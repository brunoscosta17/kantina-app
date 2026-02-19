// src/lib/interceptors.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuth } from '../store/auth';
import api from './api';

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

let interceptorsAttached = false;

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function getTenantOrThrow() {
  const { tenantId } = useAuth.getState();
  if (!tenantId) throw new Error('TenantId ausente. Faça login novamente.');
  return tenantId;
}

async function refreshAccessToken(client: AxiosInstance): Promise<string> {
  const { refreshToken } = useAuth.getState();
  const tenantId = getTenantOrThrow();

  if (!refreshToken) throw new Error('Refresh token ausente. Faça login novamente.');

  const { data } = await client.post<RefreshResponse>(
    '/auth/refresh',
    { refreshToken },
    { headers: { 'x-tenant': tenantId } }
  );

  await useAuth.getState().setSession(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export function attachInterceptors() {
  if (interceptorsAttached) return;
  interceptorsAttached = true;

  // REQUEST: Authorization + x-tenant
  api.interceptors.request.use((config) => {
    const { token, tenantId } = useAuth.getState();

    config.headers = config.headers ?? {};

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (tenantId) config.headers['x-tenant'] = tenantId;

    return config;
  });

  // RESPONSE: 401 -> refresh -> retry
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest: any = error.config;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? '';

      // 1) NUNCA tente refresh para rotas de auth "iniciais"
      // (login/register não devem disparar refresh)
      const isAuthInitial =
        url.includes('/auth/login') || url.includes('/auth/register');

      if (isAuthInitial) {
        return Promise.reject(error);
      }

      // 2) Evita loop caso /auth/refresh dê 401
      if (url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // 3) Se não temos refreshToken ainda, não tem o que fazer:
      // devolve o 401 original (isso corrige seu erro atual)
      const { refreshToken } = useAuth.getState();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // se já tentou uma vez, não tenta de novo
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          const raw = axios.create({
            baseURL: api.defaults.baseURL,
            timeout: api.defaults.timeout,
          });

          refreshPromise = refreshAccessToken(raw).finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
        }

        const newAccessToken = await (refreshPromise as Promise<string>);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (e) {
        await useAuth.getState().logout();
        return Promise.reject(e);
      }
    }
  );
}

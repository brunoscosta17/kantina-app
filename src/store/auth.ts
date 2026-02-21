import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import api from '../lib/api';
import { resolveTenant as resolveTenantApi } from '../services/tenants';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

type AuthState = {
  hydrated: boolean;

  tenantCode?: string;      // 000000 (input do usuário)
  tenantId?: string;        // UUID real (ou "demo" no dev)
  tenantName?: string;

  token?: string; // accessToken
  refreshToken?: string;

  setTenant: (p: { tenantCode?: string; tenantId?: string; tenantName?: string }) => Promise<void>;
  clearTenant: () => Promise<void>;
  setSession: (accessToken?: string, refreshToken?: string) => Promise<void>;

  resolveTenant: (code: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;

  load: () => Promise<void>;
  logout: (opts?: { clearTenant?: boolean }) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  hydrated: false,

  tenantCode: undefined,
  tenantId: undefined,
  tenantName: undefined,

  token: undefined,
  refreshToken: undefined,

  setTenant: async ({ tenantCode, tenantId, tenantName }) => {
    if (tenantCode) await SecureStore.setItemAsync('tenantCode', tenantCode);
    else await SecureStore.deleteItemAsync('tenantCode');

    if (tenantId) await SecureStore.setItemAsync('tenantId', tenantId);
    else await SecureStore.deleteItemAsync('tenantId');

    if (tenantName) await SecureStore.setItemAsync('tenantName', tenantName);
    else await SecureStore.deleteItemAsync('tenantName');

    set({ tenantCode, tenantId, tenantName });
  },

  clearTenant: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('tenantCode'),
      SecureStore.deleteItemAsync('tenantId'),
      SecureStore.deleteItemAsync('tenantName'),
    ]);
    set({ tenantCode: undefined, tenantId: undefined, tenantName: undefined });
  },

  setSession: async (accessToken, refreshToken) => {
    if (accessToken) await SecureStore.setItemAsync('token', accessToken);
    else await SecureStore.deleteItemAsync('token');

    if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
    else await SecureStore.deleteItemAsync('refreshToken');

    set({ token: accessToken, refreshToken });
  },

  resolveTenant: async (code: string) => {
    const resolved = await resolveTenantApi(code);
    await get().setTenant({
      tenantCode: resolved.code,
      tenantId: resolved.tenantId,
      tenantName: resolved.name,
    });
  },

  login: async (email, password) => {
    const tenantId = get().tenantId;
    if (!tenantId) throw new Error('Tenant não definido. Selecione a escola novamente.');

    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    await get().setSession(data.accessToken, data.refreshToken);
  },

  load: async () => {
    const [tenantCode, tenantId, tenantName, token, refreshToken] = await Promise.all([
      SecureStore.getItemAsync('tenantCode'),
      SecureStore.getItemAsync('tenantId'),
      SecureStore.getItemAsync('tenantName'),
      SecureStore.getItemAsync('token'),
      SecureStore.getItemAsync('refreshToken'),
    ]);

    set({
      tenantCode: tenantCode ?? undefined,
      tenantId: tenantId ?? undefined,
      tenantName: tenantName ?? undefined,
      token: token ?? undefined,
      refreshToken: refreshToken ?? undefined,
      hydrated: true,
    });
  },

  logout: async (opts) => {
    await Promise.all([
      SecureStore.deleteItemAsync('token'),
      SecureStore.deleteItemAsync('refreshToken'),
      opts?.clearTenant ? SecureStore.deleteItemAsync('tenantCode') : Promise.resolve(),
      opts?.clearTenant ? SecureStore.deleteItemAsync('tenantId') : Promise.resolve(),
      opts?.clearTenant ? SecureStore.deleteItemAsync('tenantName') : Promise.resolve(),
    ]);

    set({
      token: undefined,
      refreshToken: undefined,
      ...(opts?.clearTenant ? { tenantCode: undefined, tenantId: undefined, tenantName: undefined } : {}),
    });
  },
}));

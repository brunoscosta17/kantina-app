import { create } from 'zustand';
import api from '../lib/api';
import { deleteItemAsync, getItemAsync, setItemAsync } from '../lib/storage';
import { resolveTenant as resolveTenantApi } from '../services/tenants';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  role: string;
};

type AuthState = {
  hydrated: boolean;

  tenantCode?: string;      // 000000 (input do usuário)
  tenantId?: string;        // UUID real (ou "demo" no dev)
  tenantName?: string;

  token?: string; // accessToken
  refreshToken?: string;
  role?: string;

  setTenant: (p: { tenantCode?: string; tenantId?: string; tenantName?: string }) => Promise<void>;
  clearTenant: () => Promise<void>;
  setSession: (accessToken?: string, refreshToken?: string, role?: string) => Promise<void>;

  resolveTenant: (code: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  studentLogin: (accessCode: string) => Promise<void>;

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
    if (tenantCode) await setItemAsync('tenantCode', tenantCode);
    else await deleteItemAsync('tenantCode');

    if (tenantId) await setItemAsync('tenantId', tenantId);
    else await deleteItemAsync('tenantId');

    if (tenantName) await setItemAsync('tenantName', tenantName);
    else await deleteItemAsync('tenantName');

    set({ tenantCode, tenantId, tenantName });
  },

  clearTenant: async () => {
    await Promise.all([
      deleteItemAsync('tenantCode'),
      deleteItemAsync('tenantId'),
      deleteItemAsync('tenantName'),
    ]);
    set({ tenantCode: undefined, tenantId: undefined, tenantName: undefined });
  },

  setSession: async (accessToken, refreshToken, role) => {
    if (accessToken) await setItemAsync('token', accessToken);
    else await deleteItemAsync('token');

    if (refreshToken) await setItemAsync('refreshToken', refreshToken);
    else await deleteItemAsync('refreshToken');

    if (role) await setItemAsync('role', role);
    else await deleteItemAsync('role');

    set({ token: accessToken, refreshToken, role });
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
    const tenantCode = get().tenantCode;
    const tenantId = get().tenantId;
    if (!tenantId) throw new Error('Tenant não definido. Selecione a escola novamente.');
    // Log para futuras implementações
    console.log('[LOGIN] tenantCode:', tenantCode, 'tenantId:', tenantId);
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password }, {
      headers: { 'x-tenant': tenantId },
    });
    await get().setSession(data.accessToken, data.refreshToken, data.role);
  },

  studentLogin: async (accessCode) => {
    const tenantId = get().tenantId;
    if (!tenantId) throw new Error('Tenant não definido.');
    const { data } = await api.post<LoginResponse>('/auth/student-login', { accessCode }, {
      headers: { 'x-tenant': tenantId },
    });
    await get().setSession(data.accessToken, data.refreshToken, data.role);
  },

  load: async () => {
    const [tenantCode, tenantId, tenantName, token, refreshToken, role] = await Promise.all([
      getItemAsync('tenantCode'),
      getItemAsync('tenantId'),
      getItemAsync('tenantName'),
      getItemAsync('token'),
      getItemAsync('refreshToken'),
      getItemAsync('role'),
    ]);

    set({
      tenantCode: tenantCode ?? undefined,
      tenantId: tenantId ?? undefined,
      tenantName: tenantName ?? undefined,
      token: token ?? undefined,
      refreshToken: refreshToken ?? undefined,
      role: role ?? undefined,
      hydrated: true,
    });
  },

  logout: async (opts) => {
    await Promise.all([
      deleteItemAsync('token'),
      deleteItemAsync('refreshToken'),
      deleteItemAsync('role'),
      opts?.clearTenant ? deleteItemAsync('tenantCode') : Promise.resolve(),
      opts?.clearTenant ? deleteItemAsync('tenantId') : Promise.resolve(),
      opts?.clearTenant ? deleteItemAsync('tenantName') : Promise.resolve(),
    ]);

    set({
      token: undefined,
      refreshToken: undefined,
      role: undefined,
      ...(opts?.clearTenant ? { tenantCode: undefined, tenantId: undefined, tenantName: undefined } : {}),
    });
  },
}));

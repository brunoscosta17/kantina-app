import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import api from '../lib/api';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

type AuthState = {
  hydrated: boolean;

  tenantId?: string;
  token?: string; // accessToken
  refreshToken?: string;

  setTenant: (tid?: string) => Promise<void>;
  setSession: (accessToken?: string, refreshToken?: string) => Promise<void>;

  login: (tenantId: string, email: string, password: string) => Promise<void>;
  load: () => Promise<void>;
  logout: (opts?: { clearTenant?: boolean }) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  hydrated: false,

  tenantId: undefined,
  token: undefined,
  refreshToken: undefined,

  setTenant: async (tid) => {
    if (tid) await SecureStore.setItemAsync('tenantId', tid);
    else await SecureStore.deleteItemAsync('tenantId');
    set({ tenantId: tid });
  },

  setSession: async (accessToken, refreshToken) => {
    if (accessToken) await SecureStore.setItemAsync('token', accessToken);
    else await SecureStore.deleteItemAsync('token');

    if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
    else await SecureStore.deleteItemAsync('refreshToken');

    set({ token: accessToken, refreshToken });
  },

  login: async (tenantId, email, password) => {
    // garante tenant persistido
    await get().setTenant(tenantId);

    const { data } = await api.post<LoginResponse>(
      '/auth/login',
      { email, password },
      { headers: { 'x-tenant': tenantId } }
    );

    await get().setSession(data.accessToken, data.refreshToken);
  },

  load: async () => {
    const [tid, t, rt] = await Promise.all([
      SecureStore.getItemAsync('tenantId'),
      SecureStore.getItemAsync('token'),
      SecureStore.getItemAsync('refreshToken'),
    ]);

    set({
      tenantId: tid ?? undefined,
      token: t ?? undefined,
      refreshToken: rt ?? undefined,
      hydrated: true,
    });
  },

  logout: async (opts) => {
    await Promise.all([
      SecureStore.deleteItemAsync('token'),
      SecureStore.deleteItemAsync('refreshToken'),
      opts?.clearTenant ? SecureStore.deleteItemAsync('tenantId') : Promise.resolve(),
    ]);

    set({
      token: undefined,
      refreshToken: undefined,
      ...(opts?.clearTenant ? { tenantId: undefined } : {}),
    });
  },
}));

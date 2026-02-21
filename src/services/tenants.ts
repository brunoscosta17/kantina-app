import api from '../lib/api';

export type ResolveTenantResponse = {
  tenantId: string;
  name: string;
  code: string;
};

export async function resolveTenant(code: string) {
  const { data } = await api.get<ResolveTenantResponse>(`/tenants/resolve?code=${encodeURIComponent(code)}`);
  return data;
}

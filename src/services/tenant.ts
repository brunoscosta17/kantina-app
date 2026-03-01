import api from '../lib/api';

export async function updateTenantPixConfig(token: string, tenantId: string, data: any) {
  return api.patch(`/tenants/${tenantId}/pix-config`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

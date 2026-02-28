import api from '../lib/api';

export async function getWalletsOfResponsible(token: string, tenantId: string) {
  const { data } = await api.get('/auth/me/wallets', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-tenant': tenantId,
    },
  });
  return data;
}

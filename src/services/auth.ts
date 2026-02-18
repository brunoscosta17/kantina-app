import api from '../lib/api';

export async function login(tenantId: string, email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password }, {
    headers: { 'x-tenant': tenantId },
  });
  return data as { accessToken: string; tokenType: 'Bearer'; expiresIn: number };
}

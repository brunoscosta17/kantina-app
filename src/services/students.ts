import api from '../lib/api';

export async function getStudentsOfResponsible(token: string, tenantId: string) {
  const { data } = await api.get('/auth/me/alunos', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-tenant': tenantId,
    },
  });
  return data;
}

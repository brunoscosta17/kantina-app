import api from '../lib/api';
export async function getWallet(studentId: string) {
  const { data } = await api.get(`/wallets/${studentId}`);
  return data as { balanceCents: number; transactions: any[] };
}

import api from '../lib/api';
export async function createOrder(studentId: string, items: { itemId: string; qty: number }[]) {
  const { data } = await api.post('/orders', { studentId, items });
  return data;
}
export async function listOrders() {
  const { data } = await api.get('/orders');
  return data;
}

export async function fulfillOrder(orderId: string) {
  const { data } = await api.post(`/orders/${orderId}/fulfill`);
  return data;
}

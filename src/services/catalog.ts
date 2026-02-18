import api from '../lib/api';

export type CatalogItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  category?: { id: string; name: string };
};

export async function getCatalog() {
  const { data } = await api.get('/catalog');
  return data as CatalogItem[];
}

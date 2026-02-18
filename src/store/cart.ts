// import { create } from 'zustand';
// import type { CatalogItem } from '../services/catalog';

// type CartLine = {
//   item: CatalogItem;
//   qty: number;
// };

// type CartState = {
//   lines: Record<string, CartLine>;
//   add: (item: CatalogItem) => void;
//   inc: (itemId: string) => void;
//   dec: (itemId: string) => void;
//   clear: () => void;
//   totalItems: () => number;
// };

// export const useCart = create<CartState>((set, get) => ({
//   lines: {},

//   add: (item) =>
//     set((s) => {
//       const current = s.lines[item.id];
//       const qty = current ? current.qty + 1 : 1;
//       return { lines: { ...s.lines, [item.id]: { item, qty } } };
//     }),

//   inc: (itemId) =>
//     set((s) => {
//       const current = s.lines[itemId];
//       if (!current) return s;
//       return { lines: { ...s.lines, [itemId]: { ...current, qty: current.qty + 1 } } };
//     }),

//   dec: (itemId) =>
//     set((s) => {
//       const current = s.lines[itemId];
//       if (!current) return s;
//       const nextQty = current.qty - 1;
//       const copy = { ...s.lines };
//       if (nextQty <= 0) delete copy[itemId];
//       else copy[itemId] = { ...current, qty: nextQty };
//       return { lines: copy };
//     }),

//   clear: () => set({ lines: {} }),

//   totalItems: () => Object.values(get().lines).reduce((sum, l) => sum + l.qty, 0),
// }));

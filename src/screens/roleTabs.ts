// src/screens/roleTabs.ts
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';
import WalletHistoryScreen from './wallet/WalletHistoryScreen';
// Importe outras telas conforme forem criadas

export type RoleKey = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'RESPONSAVEL' | 'ALUNO';

export const roleTabs: Record<RoleKey, Array<{ name: string; component: any; icon: string }>> = {
  ADMIN: [
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    // Adicione novas telas aqui
  ],
  GESTOR: [
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
  ],
  OPERADOR: [
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
  ],
  RESPONSAVEL: [
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Extrato', component: WalletHistoryScreen, icon: 'file-document' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
  ],
  ALUNO: [
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
  ],
};

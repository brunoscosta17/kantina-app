// src/screens/roleTabs.ts
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';
import WalletHistoryScreen from './wallet/WalletHistoryScreen';
import PDVScreen from './pdv/PDVScreen';
import ReportsScreen from './reports/ReportsScreen';

export type RoleKey = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'RESPONSAVEL' | 'ALUNO';

export const roleTabs: Record<RoleKey, Array<{ name: string; component: any; icon: string }>> = {
  ADMIN: [
    { name: 'Caixa PDV', component: PDVScreen, icon: 'cash-register' },
    { name: 'Relatórios', component: ReportsScreen, icon: 'chart-bar' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Configurações', component: SettingsScreen, icon: 'cog' },
    // Adicione novas telas aqui
  ],
  GESTOR: [
    { name: 'Caixa PDV', component: PDVScreen, icon: 'cash-register' },
    { name: 'Relatórios', component: ReportsScreen, icon: 'chart-bar' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Configurações', component: SettingsScreen, icon: 'cog' },
  ],
  OPERADOR: [
    { name: 'Caixa PDV', component: PDVScreen, icon: 'cash-register' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Configurações', component: SettingsScreen, icon: 'cog' },
  ],
  RESPONSAVEL: [
    { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
    { name: 'Extrato', component: WalletHistoryScreen, icon: 'file-document' },
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Configurações', component: SettingsScreen, icon: 'cog' },
  ],
  ALUNO: [
    { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
    { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
    { name: 'Configurações', component: SettingsScreen, icon: 'cog' },
  ],
};

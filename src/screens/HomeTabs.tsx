import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import { useAuth } from '../store/auth';
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';
// Função para suavizar cor (mistura com branco)
function lighten(color: string, percent: number) {
  // Aceita cor hex tipo #RRGGBB
  const num = parseInt(color.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const newR = Math.round(r + (255 - r) * percent);
  const newG = Math.round(g + (255 - g) * percent);
  const newB = Math.round(b + (255 - b) * percent);
  return `rgb(${newR},${newG},${newB})`;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function HomeTabs() {
  const role = useAuth((s) => s.role);

  // Define abas por perfil
  let tabs: Array<{ name: string; component: any } & { icon: string }> = [];
  if (role === 'ADMIN' || role === 'GESTOR') {
    tabs = [
      { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
      { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
      { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
      { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    ];
  } else if (role === 'OPERADOR') {
    tabs = [
      { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
      { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
      { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    ];
  } else if (role === 'RESPONSAVEL') {
    tabs = [
      { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
      { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
      { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
      { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    ];
  } else if (role === 'ALUNO') {
    tabs = [
      { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
      { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
      { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    ];
  } else {
    // fallback: todas as abas
    tabs = [
      { name: 'Catálogo', component: CatalogScreen, icon: 'food-fork-drink' },
      { name: 'Pedidos', component: OrdersScreen, icon: 'clipboard-list' },
      { name: 'Carteira', component: WalletScreen, icon: 'wallet' },
      { name: 'Ajustes', component: SettingsScreen, icon: 'cog' },
    ];
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: {
          color: COLORS.orange,
          fontSize: 28,
          fontWeight: '700',
        },
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 12,
          height: 70,
        },
        tabBarItemStyle: {
          marginTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const tab = tabs.find(t => t.name === route.name);
          return tab ? <Icon name={tab.icon} size={size} color={color} /> : null;
        },
      })}
    >
      {tabs.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

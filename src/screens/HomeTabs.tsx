import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
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
          let iconName = '';
          if (route.name === 'Catálogo') iconName = 'food-fork-drink';
          else if (route.name === 'Pedidos') iconName = 'clipboard-list';
          else if (route.name === 'Carteira') iconName = 'wallet';
          else if (route.name === 'Ajustes') iconName = 'cog';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Catálogo" component={CatalogScreen} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} />
      <Tab.Screen name="Carteira" component={WalletScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

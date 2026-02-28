import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';

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
          backgroundColor: COLORS.cream,
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

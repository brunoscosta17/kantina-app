import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from './catalog/CatalogScreen';
import OrdersScreen from './orders/OrdersScreen';
import SettingsScreen from './settings/SettingsScreen';
import WalletScreen from './wallet/WalletScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Catálogo" component={CatalogScreen} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} />
      <Tab.Screen name="Carteira" component={WalletScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

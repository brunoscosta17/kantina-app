import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import { useAuth } from '../store/auth';
import { RoleKey, roleTabs } from './roleTabs';
import NotificationBell from '../components/NotificationBell';
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
  const role = useAuth((s) => s.role) as RoleKey;
  const tabs = roleTabs[role] ?? roleTabs['ALUNO'];

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
        headerRight: () => <NotificationBell />,
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

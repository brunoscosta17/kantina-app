import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import { useAuth } from '../store/auth';
import { RoleKey, roleTabs } from './roleTabs';
import NotificationBell from '../components/NotificationBell';
import SideMenu from '../components/SideMenu';
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

export default function HomeTabs({ navigation }: any) {
  const role = useAuth((s) => s.role) as RoleKey;
  const tabs = roleTabs[role] ?? roleTabs['ALUNO'];
  const [menuVisible, setMenuVisible] = useState(false);

  const mainTabs = tabs.slice(0, 3);
  const secondaryTabs = tabs.slice(3);

  const menuItems = secondaryTabs.map(t => ({
    name: t.name,
    icon: t.icon,
    onPress: () => {
      navigation.navigate(t.name);
    }
  }));

  return (
    <>
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginLeft: 20 }}>
              <Icon name="menu" size={28} color={COLORS.orange} />
            </TouchableOpacity>
          ),
          headerRight: () => <NotificationBell />,
          tabBarItemStyle: {
            marginTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Mais') return <Icon name="menu" size={size} color={color} />;
            const tab = tabs.find(t => t.name === route.name);
            return tab ? <Icon name={tab.icon} size={size} color={color} /> : null;
          },
        })}
      >
        {tabs.map((tab, index) => {
          // Exibe na Tab Bar os 4 primeiros no máximo (se role permitir) ou 3, etc. Dependendo de mainTabs.
          // Como fizemos mainTabs = tabs.slice(0, 3) antes, vamos reusar essa lógica.
          const isMain = index < 3;
          return (
            <Tab.Screen 
              key={tab.name} 
              name={tab.name} 
              component={tab.component}
              options={!isMain ? { tabBarButton: () => null } : {}}
            />
          );
        })}
      </Tab.Navigator>
      
      <SideMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        items={menuItems} 
      />
    </>
  );
}

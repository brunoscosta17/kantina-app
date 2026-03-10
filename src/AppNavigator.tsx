import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './screens/HomeTabs';
import LoginScreen from './screens/LoginScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import SelectSchoolScreen from './screens/SelectSchoolScreen';
import { useAuth } from './store/auth';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuth((s) => s.token);
  const tenantId = useAuth((s) => s.tenantId);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!tenantId ? (
        <Stack.Screen name="SelectSchool" component={SelectSchoolScreen} />
      ) : token ? (
        <Stack.Group>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ 
              headerShown: true, 
              title: 'Notificações',
              headerTitleStyle: { color: COLORS.orange, fontWeight: 'bold' },
              headerTintColor: COLORS.orange,
              headerBackButtonDisplayMode: 'minimal',
            }} 
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

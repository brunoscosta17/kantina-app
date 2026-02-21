import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './screens/HomeTabs';
import LoginScreen from './screens/LoginScreen';
import SelectSchoolScreen from './screens/SelectSchoolScreen';
import { useAuth } from './store/auth';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuth((s) => s.token);
  const tenantId = useAuth((s) => s.tenantId);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!tenantId ? (
        <Stack.Screen name="SelectSchool" component={SelectSchoolScreen} />
      ) : token ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './screens/HomeTabs';
import LoginScreen from './screens/LoginScreen';
import { useAuth } from './store/auth';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuth((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

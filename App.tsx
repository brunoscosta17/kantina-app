import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/AppNavigator';
import { attachInterceptors } from './src/lib/interceptors';
import { useAuth } from './src/store/auth';
import { theme } from './theme';

export default function App() {
  const load = useAuth((s) => s.load);
  const hydrated = useAuth((s) => s.hydrated);

  useEffect(() => {
    attachInterceptors();
    load();
  }, [load]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

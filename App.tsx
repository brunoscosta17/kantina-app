import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { attachInterceptors } from './src/lib/interceptors';
import { useAuth } from './src/store/auth';

import { Provider as PaperProvider } from 'react-native-paper';

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
    <PaperProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

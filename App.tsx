// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { attachInterceptors } from './src/lib/interceptors';
import { useAuth } from './src/store/auth';

import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';

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
    <TamaguiProvider config={config} defaultTheme="light">
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TamaguiProvider>
  );
}

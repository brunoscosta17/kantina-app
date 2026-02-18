import Constants from 'expo-constants';
import React from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/auth';

export default function SettingsScreen() {
  const tenantId = useAuth((s) => s.tenantId);
  const token = useAuth((s) => s.token);
  const logout = useAuth((s) => s.logout);

  const apiUrl =
    Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

  async function onLogout() {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>
        Ajustes
      </Text>

      <View style={{ gap: 8, marginBottom: 20 }}>
        <Text style={{ fontWeight: '600' }}>API</Text>
        <Text style={{ color: '#666' }}>{apiUrl}</Text>

        <Text style={{ fontWeight: '600', marginTop: 12 }}>Tenant</Text>
        <Text style={{ color: '#666' }}>{tenantId ?? '(não definido)'}</Text>

        <Text style={{ fontWeight: '600', marginTop: 12 }}>Sessão</Text>
        <Text style={{ color: '#666' }}>
          {token ? 'Logado' : 'Deslogado'}
        </Text>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <Button title="Sair" onPress={onLogout} />
      </View>
    </SafeAreaView>
  );
}

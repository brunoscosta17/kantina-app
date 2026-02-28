import Constants from 'expo-constants';
import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme';
import { useAuth } from '../../store/auth';

export default function SettingsScreen() {
  const tenantCode = useAuth((s) => s.tenantCode);
  const tenantId = useAuth((s) => s.tenantId);
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);
  const logout = useAuth((s) => s.logout);

  const roleLabel = {
    ADMIN: 'Administrador',
    GESTOR: 'Gestor',
    OPERADOR: 'Operador',
    RESPONSAVEL: 'Responsável',
    ALUNO: 'Aluno',
  } as const;

  const getRoleLabel = (r?: string) => r ? roleLabel[r as keyof typeof roleLabel] ?? r : '(não definido)';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      {/* Título removido, apenas conteúdo */}
      {/* <View style={{ marginBottom: 12 }}>
        <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700' }}>
          Ajustes
        </Text>
      </View> */}

      <View style={{ gap: 8, marginBottom: 20 }}>
        <Text style={{ color: COLORS.text, fontWeight: '600' }}>API</Text>
        <Text style={{ color: COLORS.greenDark }}>{apiUrl}</Text>

        <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 12 }}>Tenant</Text>
        <Text style={{ color: COLORS.greenDark }}>{tenantId ?? '(não definido)'}</Text>

        <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 12 }}>Perfil</Text>
        <Text style={{ color: COLORS.greenDark }}>{getRoleLabel(role)}</Text>

        <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 12 }}>Sessão</Text>
        <Text style={{ color: COLORS.orange }}>
          {token ? 'Logado' : 'Deslogado'}
        </Text>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <Button mode="contained" style={{ backgroundColor: COLORS.greenDark }} onPress={onLogout}>
          Sair
        </Button>
      </View>
    </SafeAreaView>
  );
}

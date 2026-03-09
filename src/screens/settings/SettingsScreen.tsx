import Constants from 'expo-constants';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme';
import { useAuth } from '../../store/auth';
import { updateTenantPixConfig } from '../../services/tenant';
import PixConfigScreen from './PixConfigScreen';

export default function SettingsScreen() {
  const tenantCode = useAuth((s) => s.tenantCode);
  const tenantId = useAuth((s) => s.tenantId);
  const tenantName = useAuth((s) => s.tenantName);
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);
  const logout = useAuth((s) => s.logout);

  const [alunos, setAlunos] = React.useState<any[]>([]);
  const [showPixConfig, setShowPixConfig] = React.useState(false);
  const [tenantData, setTenantData] = React.useState<any | null>(null);
  React.useEffect(() => {
    if (role === 'RESPONSAVEL' && token && tenantId) {
      import('../../services/students').then(({ getStudentsOfResponsible }) => {
        getStudentsOfResponsible(token, tenantId).then(setAlunos);
      });
    }
  }, [role, token, tenantId]);

  React.useEffect(() => {
    if (tenantId && (role === 'ADMIN' || role === 'GESTOR')) {
      import('../../lib/api').then(({ default: api }) => {
        api.get(`/tenants/${tenantId}`).then(({ data }) => setTenantData(data));
      });
    }
  }, [tenantId, role]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      {/* Título removido, apenas conteúdo */}
      {/* <View style={{ marginBottom: 12 }}>
        <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700' }}>
          Ajustes
        </Text>
      </View> */}

      <View style={{ gap: 8, marginBottom: 20 }}>
        <Text style={{ color: COLORS.text, fontWeight: '600' }}>Escola</Text>
        <Text style={{ color: COLORS.greenDark }}>
          {tenantCode && tenantName ? `${tenantCode} - ${tenantName}` : '(não definido)'}
        </Text>

        <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 12 }}>Perfil</Text>
        <Text style={{ color: COLORS.greenDark }}>{getRoleLabel(role)}</Text>

        <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 12 }}>Sessão</Text>
        <Text style={{ color: COLORS.orange }}>
          {token ? 'Logado' : 'Deslogado'}
        </Text>
      </View>

      {(role === 'ADMIN' || role === 'GESTOR') && tenantId && tenantData && (
        <View
          style={{
            marginBottom: 24,
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 8,
              color: COLORS.orange,
            }}
          >
            Configuração Pix da cantina
          </Text>

          {!showPixConfig ? (
            <>
              <Text style={{ color: COLORS.text, marginBottom: 4 }}>
                Provedor atual: {tenantData.pixProvider ?? '(não definido)'}
              </Text>
              <Text style={{ color: COLORS.text, marginBottom: 8 }}>
                Mínimo de recarga:{' '}
                R${' '}
                {((tenantData.minChargeCents ?? 0) / 100)
                  .toFixed(2)
                  .replace('.', ',')}
              </Text>
              <Button
                mode="outlined"
                onPress={() => setShowPixConfig(true)}
                style={{ borderRadius: 14 }}
              >
                Editar configuração Pix
              </Button>
            </>
          ) : (
            <PixConfigScreen
              initial={tenantData}
              onCancel={() => setShowPixConfig(false)}
              onSave={async (data) => {
                if (!token || !tenantId) return;
                try {
                  await updateTenantPixConfig(token, tenantId, data);
                  const updated = { ...tenantData, ...data };
                  setTenantData(updated);
                  setShowPixConfig(false);
                } catch (e) {
                  Alert.alert('Erro', 'Falha ao salvar configuração Pix.');
                }
              }}
            />
          )}
        </View>
      )}

      {role === 'RESPONSAVEL' && (
        <View style={{ marginTop: 24, padding: 16, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: COLORS.orange }}>
            Alunos sob sua responsabilidade:
          </Text>
          {alunos.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>Nenhum aluno vinculado.</Text>
          ) : (
            alunos.map((a) => (
              <View key={a.id} style={{ marginBottom: 8, padding: 8, backgroundColor: '#BFE3D0', borderRadius: 6 }}>
                <Text style={{ fontSize: 15, color: COLORS.greenDark, fontWeight: '500' }}>{a.name}</Text>
                <Text style={{ fontSize: 13, color: COLORS.text }}>{a.classroom}</Text>
                {a.accessCode ? (
                  <Text style={{ fontSize: 14, color: COLORS.text, marginTop: 4 }}>
                    Código de Acesso: <Text style={{ fontWeight: 'bold' }}>{a.accessCode}</Text>
                  </Text>
                ) : null}
                {a.wallet && (
                  <Text style={{ fontSize: 15, color: COLORS.orange, fontWeight: '600', marginTop: 4 }}>
                    Saldo: R$ {(a.wallet.balanceCents / 100).toFixed(2).replace('.', ',')}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Button mode="contained" style={{ backgroundColor: COLORS.greenDark }} onPress={onLogout}>
          Sair
        </Button>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../../../theme';
import { useAuth } from '../../store/auth';

export default function WalletScreen() {
  const tenantId = useAuth((s) => s.tenantId);
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);
  const [wallets, setWallets] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (role === 'RESPONSAVEL' && token && tenantId) {
      import('../../services/wallets').then(({ getWalletsOfResponsible }) => {
        getWalletsOfResponsible(token, tenantId).then(setWallets);
      });
    }
  }, [role, token, tenantId]);
  const onAddCredit = () => {};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* <View style={{ marginBottom: 12 }}>
          <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700' }}>
            Carteira
          </Text>
        </View> */}
        {wallets.length === 0 ? (
          <Text style={{ color: COLORS.text, fontStyle: 'italic', marginBottom: 16 }}>Nenhum aluno vinculado ou sem carteira.</Text>
        ) : (
          wallets.map((w) => (
            <View key={w.id} style={{ backgroundColor: '#BFE3D0', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.orange, marginBottom: 4 }}>{w.student?.name}</Text>
              <Text style={{ fontSize: 15, color: COLORS.text, marginBottom: 8 }}>{w.student?.classroom}</Text>
              {/* {w.student?.tenant?.name && (
                <Text style={{ fontSize: 13, color: COLORS.orange, marginBottom: 8 }}>{w.student.tenant.name}</Text>
              )} */}
              <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.greenDark }}>
                R$ {(w.balanceCents / 100).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={{ color: COLORS.orange, marginTop: 4 }}>Saldo disponível</Text>
              <Button mode="contained" style={{ backgroundColor: COLORS.greenDark, marginTop: 12 }} onPress={onAddCredit}>
                Adicionar crédito
              </Button>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../../../theme';
import api from '../../lib/api';
import { useAuth } from '../../store/auth';
import PixChargeModal from './PixChargeModal';

export default function WalletScreen() {
  const tenantId = useAuth((s) => s.tenantId);
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);
  const [wallets, setWallets] = React.useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [charge, setCharge] = useState<any>(null);

  React.useEffect(() => {
    if (role === 'RESPONSAVEL' && token && tenantId) {
      import('../../services/wallets').then(({ getWalletsOfResponsible }) => {
        getWalletsOfResponsible(token, tenantId).then(setWallets);
      });
    }
  }, [role, token, tenantId]);

  const handleAddCredit = (student: any) => {
    setSelectedStudent(student);
    setCharge(null);
    setModalVisible(true);
  };

  const handleCharge = async (valueCents: number, method: 'pix' | 'card') => {
    if (!selectedStudent) return;
    if (method === 'pix') {
      const { data } = await api.post(`/wallets/${selectedStudent.id}/pix-charge`, { valueCents }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCharge(data);
    } else {
      // Em breve: integração cartão de crédito
      setCharge({ method: 'card' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {wallets.length === 0 ? (
          <Text style={{ color: COLORS.text, fontStyle: 'italic', marginBottom: 16 }}>Nenhum aluno vinculado ou sem carteira.</Text>
        ) : (
          wallets.map((w) => (
            <View key={w.id} style={{ backgroundColor: '#BFE3D0', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.orange, marginBottom: 4 }}>{w.student?.name}</Text>
              <Text style={{ fontSize: 15, color: COLORS.text, marginBottom: 8 }}>{w.student?.classroom}</Text>
              <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.greenDark }}>
                R$ {(w.balanceCents / 100).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={{ color: COLORS.orange, marginTop: 4 }}>Saldo disponível</Text>
              <Button mode="contained" style={{ backgroundColor: COLORS.greenDark, marginTop: 12 }} onPress={() => handleAddCredit(w.student)}>
                Adicionar crédito
              </Button>
            </View>
          ))
        )}
      </ScrollView>
      <PixChargeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCharge={handleCharge}
        charge={charge}
        student={selectedStudent}
      />
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, RefreshControl } from 'react-native';
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
  const [minChargeCents, setMinChargeCents] = useState<number>(0);

  React.useEffect(() => {
    if (tenantId) {
      api.get(`/tenants/${tenantId}`).then(({ data }) => {
        setMinChargeCents(data.minChargeCents ?? 0);
      });
    }
  }, [tenantId]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchWallets = () => {
    if (role === 'RESPONSAVEL' && token && tenantId) {
      import('../../services/wallets').then(({ getWalletsOfResponsible }) => {
        getWalletsOfResponsible(token, tenantId)
          .then(setWallets)
          .finally(() => setRefreshing(false));
      });
    } else {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchWallets();
  }, [role, token, tenantId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallets();
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleAddCredit = (student: any) => {
    setSelectedStudent(student);
    setCharge(null);
    setModalVisible(true);
  };

  const handleCharge = async (valueCents: number, method: 'pix' | 'card') => {
    if (!selectedStudent) return;
    setIsLoading(true);
    if (method === 'pix') {
      try {
        const { data } = await api.post(`/wallets/${selectedStudent.id}/pix-charge`, { valueCents }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharge(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Em breve: integração cartão de crédito
      setCharge({ method: 'card' });
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.greenDark]} />}
      >
        {wallets.length === 0 ? (
          <Text style={{ color: COLORS.text, fontStyle: 'italic', marginBottom: 16 }}>Nenhum aluno vinculado ou sem carteira.</Text>
        ) : (
          wallets.map((w) => (
            <View
              key={w.id}
              style={{
                backgroundColor: '#BFE3D0',
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.orange,
                    marginBottom: 4,
                  }}
                >
                  {w.student?.name}
                </Text>
                <Text style={{ fontSize: 15, color: COLORS.text, marginBottom: 8 }}>
                  {w.student?.classroom}
                </Text>
                <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.greenDark }}>
                  R$ {(w.balanceCents / 100).toFixed(2).replace('.', ',')}
                </Text>
                <Text style={{ color: COLORS.orange, marginTop: 4 }}>Saldo disponível</Text>
                <Button
                  mode="contained"
                  style={{ backgroundColor: COLORS.greenDark, marginTop: 12 }}
                  onPress={() => handleAddCredit(w.student)}
                >
                  Adicionar crédito
                </Button>
              </View>

              {Array.isArray(w.transactions) && w.transactions.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#9AC3AF',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      marginBottom: 4,
                      color: COLORS.text,
                    }}
                  >
                    Histórico recente
                  </Text>
                  {w.transactions.map((t: any) => {
                    const isCredit = t.direction === 'CREDIT';
                    const sign = isCredit ? '+' : '-';
                    const createdAt = new Date(t.createdAt);
                    return (
                      <View
                        key={t.id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 4,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: COLORS.text,
                              fontWeight: '500',
                            }}
                          >
                            {t.label}
                          </Text>
                          <Text style={{ color: '#374151', fontSize: 12 }}>
                            {createdAt.toLocaleString('pt-BR')}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: isCredit ? COLORS.greenDark : '#B91C1C',
                            fontWeight: '700',
                          }}
                        >
                          {sign} R$ {(t.amountCents / 100).toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
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
        minChargeCents={minChargeCents}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

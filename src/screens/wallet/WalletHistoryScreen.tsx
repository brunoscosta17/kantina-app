import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, View, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { COLORS } from '../../../theme';
import { useAuth } from '../../store/auth';

// Usa o mesmo formato que a API devolve em GET /auth/me/wallets
// (wallets com student + transactions já formatadas)

type WalletWithStudent = {
  id: string;
  tenantId: string;
  studentId: string;
  balanceCents: number;
  student?: {
    id: string;
    name: string;
    classroom?: string | null;
  };
  transactions: Array<{
    id: string;
    type: string;
    label: string;
    direction: 'CREDIT' | 'DEBIT';
    amountCents: number;
    createdAt: string | Date;
  }>;
};

export default function WalletHistoryScreen() {
  const tenantId = useAuth((s) => s.tenantId);
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);

  const [wallets, setWallets] = useState<WalletWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = (mounted: { current: boolean }) => {
    if (role !== 'RESPONSAVEL' || !tenantId || !token) {
      if (mounted.current) setLoading(false);
      return;
    }

    import('../../services/wallets').then(async (mod) => {
      try {
        const data = await mod.getWalletsOfResponsible(token, tenantId);
        if (mounted.current) setWallets(data as WalletWithStudent[]);
      } catch (e) {
        console.error('Erro ao carregar carteiras do responsável', e);
        if (mounted.current) setError('Falha ao carregar extrato.');
      } finally {
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    });
  };

  useEffect(() => {
    const mounted = { current: true };
    fetchHistory(mounted);
    return () => {
      mounted.current = false;
    };
  }, [role, tenantId, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory({ current: true });
  };

  const entries = useMemo(() => {
    const all: Array<{
      id: string;
      studentName: string;
      classroom?: string | null;
      label: string;
      direction: 'CREDIT' | 'DEBIT';
      amountCents: number;
      createdAt: Date;
    }> = [];

    for (const w of wallets) {
      const studentName = w.student?.name ?? 'Aluno';
      const classroom = w.student?.classroom;
      for (const t of w.transactions ?? []) {
        const createdAt = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
        all.push({
          id: t.id,
          studentName,
          classroom,
          label: t.label,
          direction: t.direction,
          amountCents: t.amountCents,
          createdAt,
        });
      }
    }

    // Ordena do mais recente para o mais antigo
    return all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [wallets]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.text }}>{error}</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.text }}>Nenhuma movimentação encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.greenDark]} />}
          renderItem={({ item }) => {
            const isCredit = item.direction === 'CREDIT';
            const sign = isCredit ? '+' : '-';
            return (
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    color: COLORS.orange,
                    fontWeight: '700',
                    marginBottom: 2,
                  }}
                >
                  {item.studentName}
                </Text>
                {item.classroom && (
                  <Text style={{ color: '#4B5563', fontSize: 12, marginBottom: 4 }}>
                    {item.classroom}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: COLORS.text,
                        fontWeight: '500',
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>
                      {item.createdAt.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: isCredit ? COLORS.greenDark : '#B91C1C',
                      fontWeight: '700',
                    }}
                  >
                    {sign} R$ {(item.amountCents / 100).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

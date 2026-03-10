import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/currency';

type DailySummary = {
  date: string;
  pixTotalCents: number;
  manualTotalCents: number;
  consumptionTotalCents: number;
  totalRetainedCents: number;
};

export default function ReportsScreen() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    try {
      const { data } = await api.get<DailySummary>('/reports/daily-summary');
      setSummary(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar resumo do dia:', err);
      setError('Não foi possível carregar o painel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSummary();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !summary) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  const [year, month, day] = summary.date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Fechamento de Caixa
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Resumo financeiro - {formattedDate}
        </Text>

        <View style={styles.grid}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="labelLarge" style={styles.label}>Recebido via Pix (Dia)</Text>
              <Text variant="titleLarge" style={styles.valueGreen}>
                {formatCurrency(summary.pixTotalCents)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="labelLarge" style={styles.label}>Recargas Manuais (Dia)</Text>
              <Text variant="titleLarge" style={styles.valueGreen}>
                {formatCurrency(summary.manualTotalCents)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="labelLarge" style={styles.label}>Vendas / Consumo (Dia)</Text>
              <Text variant="titleLarge" style={styles.valueOrange}>
                {formatCurrency(summary.consumptionTotalCents)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: '#e8f5e9' }]}>
            <Card.Content>
              <Text variant="labelLarge" style={[styles.label, { color: COLORS.greenDark }]}>Saldo Retido Total (Geral)</Text>
              <Text variant="headlineSmall" style={[styles.valueGreen, { fontWeight: '900' }]}>
                {formatCurrency(summary.totalRetainedCents)}
              </Text>
              <Text variant="bodySmall" style={{ color: COLORS.greenDark, marginTop: 4 }}>
                Soma do saldo nas carteiras de todos os alunos.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  valueGreen: {
    fontWeight: 'bold',
    color: COLORS.greenDark,
  },
  valueOrange: {
    fontWeight: 'bold',
    color: COLORS.orange,
  },
});

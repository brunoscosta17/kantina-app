import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Icon,
  IconButton,
  List,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/currency';
import { COLORS } from '../../../theme';

type Student = {
  id: string;
  name: string;
  accessCode?: string;
};

type CatalogItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

type CartItem = CatalogItem & { qty: number };

export default function PDVScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentBalance, setStudentBalance] = useState<number | null>(null);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Carrega o catálogo logo no início para agilizar o PDV
    api.get('/catalog').then((res) => setCatalog(res.data)).catch(console.error);
  }, []);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length < 3) {
      setStudents([]);
      return;
    }
    setSearching(true);
    try {
      // Endpoint GET /students suporta a query string genérica ?search=
      const { data } = await api.get('/students', { params: { search: text } });
      setStudents(data.data || data); // Depende se a API pagina (data.data) ou retorna array direto
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const selectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery('');
    setStudents([]);
    try {
      const { data } = await api.get(`/wallets/${student.id}`);
      setStudentBalance(data.balanceCents);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar o saldo do aluno.');
    }
  };

  const addToCart = (item: CatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c));
      }
      return prev.filter((c) => c.id !== itemId);
    });
  };

  const cancelSale = () => {
    setSelectedStudent(null);
    setStudentBalance(null);
    setCart([]);
  };

  const handleCheckout = async () => {
    if (!selectedStudent || cart.length === 0) return;
    setProcessing(true);
    try {
      // 1. Criar pedido e descontar da carteira
      const payload = {
        studentId: selectedStudent.id,
        items: cart.map((c) => ({ itemId: c.id, qty: c.qty })),
      };
      const { data } = await api.post('/orders', payload);
      
      // 2. Marcar como entregue imediatamente (PDV já entrega no balcão)
      await api.post(`/orders/${data.order.id}/fulfill`);

      Alert.alert('Sucesso', 'Venda realizada com sucesso!');
      cancelSale(); // Reseta para o próximo cliente
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao faturar pedido.';
      Alert.alert('Erro', Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setProcessing(false);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);

  if (!selectedStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>PDV - Caixa</Text>
          <Text variant="bodyMedium" style={{ color: '#666' }}>
            Busque o aluno por Nome ou Código de Acesso
          </Text>
        </View>

        <Searchbar
          placeholder="Buscar Aluno..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          loading={searching}
          autoCorrect={false}
        />

        <FlatList
          data={students}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.accessCode ? `Código: ${item.accessCode}` : 'Sem código de acesso'}
              left={(props) => <List.Icon {...props} icon="account-circle" />}
              onPress={() => selectStudent(item)}
              style={styles.studentItem}
            />
          )}
          ListEmptyComponent={
            searchQuery.length >= 3 && !searching ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum aluno encontrado.</Text>
            ) : null
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{selectedStudent.name}</Text>
          <Text variant="bodyMedium" style={{ color: studentBalance !== null && studentBalance < cartTotal ? 'red' : COLORS.greenDark }}>
            Saldo: {studentBalance !== null ? formatCurrency(studentBalance) : 'Carregando...'}
          </Text>
        </View>
        <Button mode="text" textColor="red" onPress={cancelSale}>Cancelar</Button>
      </View>

      <View style={styles.mainContent}>
        {/* Catálogo List */}
        <View style={styles.catalogArea}>
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>Cardápio</Text>
          <FlatList
            data={catalog}
            keyExtractor={(c) => c.id}
            numColumns={2}
            renderItem={({ item }) => (
              <Card style={styles.catalogCard} onPress={() => addToCart(item)}>
                <Card.Content>
                  <Text variant="bodyLarge" numberOfLines={2}>{item.name}</Text>
                  <Text variant="labelLarge" style={{ color: COLORS.greenDark, marginTop: 4 }}>
                    {formatCurrency(item.priceCents)}
                  </Text>
                </Card.Content>
              </Card>
            )}
          />
        </View>

        {/* Carrinho Area */}
        <View style={styles.cartArea}>
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>Carrinho</Text>
          <FlatList
            data={cart}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <View style={styles.cartRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" numberOfLines={1}>{item.name}</Text>
                  <Text variant="labelSmall" style={{ color: '#666' }}>{formatCurrency(item.priceCents)}</Text>
                </View>
                <View style={styles.qtyControls}>
                  <IconButton icon="minus-circle-outline" size={20} onPress={() => removeFromCart(item.id)} />
                  <Text>{item.qty}</Text>
                  <IconButton icon="plus-circle-outline" size={20} iconColor={COLORS.greenDark} onPress={() => addToCart(item)} />
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <Divider />}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', padding: 20 }}>Carrinho vazio</Text>}
          />

          <View style={styles.checkoutBox}>
            <View style={styles.totalRow}>
              <Text variant="titleMedium">Total:</Text>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{formatCurrency(cartTotal)}</Text>
            </View>
            <Button
              mode="contained"
              buttonColor={COLORS.greenDark}
              onPress={handleCheckout}
              loading={processing}
              disabled={cart.length === 0 || processing || (studentBalance !== null && studentBalance < cartTotal)}
              style={styles.checkoutBtn}
            >
              FATURAR
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 16,
    backgroundColor: '#fff',
  },
  studentItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column', // Changed from row to column for mobile
  },
  catalogArea: {
    flex: 1,
    padding: 8,
  },
  catalogCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cartArea: {
    maxHeight: '45%', // Limits cart height so catalog is always visible
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutBox: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  checkoutBtn: {
    paddingVertical: 6,
  },
});

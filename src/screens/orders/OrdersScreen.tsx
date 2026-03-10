import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { COLORS } from '../../../theme';
import { listOrders, fulfillOrder } from '../../services/orders';
import { useAuth } from '../../store/auth';

type OrderItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersScreen() {
  const role = useAuth((s) => s.role);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listOrders();
        if (mounted) setOrders(data as Order[]);
      } catch (e) {
        console.error('Erro ao carregar pedidos', e);
        if (mounted) setError('Falha ao carregar pedidos.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFulfill = async (orderId: string) => {
    try {
      await fulfillOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'FULFILLED' } : o))
      );
    } catch (e) {
      console.error('Erro ao confirmar entrega', e);
      alert('Não foi possível confirmar a entrega do pedido.');
    }
  };

  if (!role) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.text }}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.text }}>Nenhum pedido encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const totalCents = item.items.reduce(
              (sum, it) => sum + it.unitPriceCents * it.qty,
              0,
            );
            const createdAt = new Date(item.createdAt);
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text
                      style={{ color: COLORS.text, fontWeight: '600', fontSize: 16 }}
                    >
                      Pedido #{item.id.slice(0, 8).toUpperCase()}
                    </Text>
                    <Text style={{ color: COLORS.orange, marginTop: 4 }}>
                      {item.status}
                    </Text>
                    <Text style={{ color: COLORS.text, marginTop: 4, fontSize: 12 }}>
                      {createdAt.toLocaleString('pt-BR')}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.greenDark,
                        marginTop: 4,
                        fontWeight: '700',
                      }}
                    >
                      R$ {(totalCents / 100).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                  
                  {item.status === 'PAID' && ['ADMIN', 'GESTOR', 'OPERADOR'].includes(role) && (
                    <Button 
                      mode="contained" 
                      buttonColor={COLORS.greenDark} 
                      onPress={() => handleFulfill(item.id)}
                    >
                      Entregar
                    </Button>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

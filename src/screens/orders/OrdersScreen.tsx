// import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
// import { createOrder } from '../../services/orders';
// import { useCart } from '../../store/cart';

// const STUDENT_ID = 'demo-student'; // depois você pluga isso certo

// export default function OrdersScreen() {
//   const lines = useCart((s) => Object.values(s.lines));
//   const inc = useCart((s) => s.inc);
//   const dec = useCart((s) => s.dec);
//   const clear = useCart((s) => s.clear);

//   async function onSend() {
//     if (lines.length === 0) return Alert.alert('Carrinho vazio');

//     try {
//       const items = lines.map((l) => ({ itemId: l.item.id, qty: l.qty }));
//       await createOrder(STUDENT_ID, items);
//       clear();
//       Alert.alert('Pedido enviado ✅');
//     } catch (e: any) {
//       Alert.alert('Erro ao enviar pedido', e?.response?.data?.message ?? String(e));
//     }
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
//       <Text style={{ fontSize: 22, fontWeight: '700' }}>Seu pedido</Text>

//       {lines.length === 0 ? (
//         <Text style={{ color: '#666' }}>Adicione itens no Catálogo.</Text>
//       ) : (
//         <View style={{ gap: 12 }}>
//           {lines.map((l) => (
//             <View key={l.item.id} style={{ padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 10 }}>
//               <Text style={{ fontWeight: '700' }}>{l.item.name}</Text>
//               <Text>Qtd: {l.qty}</Text>
//               <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
//                 <Button title="-" onPress={() => dec(l.item.id)} />
//                 <Button title="+" onPress={() => inc(l.item.id)} />
//               </View>
//             </View>
//           ))}

//           <Button title="Enviar pedido" onPress={onSend} />
//           <Button title="Limpar carrinho" onPress={clear} />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { COLORS } from '../../../theme';

export default function OrdersScreen() {
  // Mock de pedidos para exibição
  const orders = [
    { id: '101', status: 'Pendente', total: '12.00' },
    { id: '102', status: 'Finalizado', total: '8.50' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      {/* Título removido, apenas lista */}
      <FlatList
        // ListHeaderComponent={() => (
        //   <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700', marginBottom: 12 }}>
        //     Pedidos
        //   </Text>
        // )}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 16 }}>Pedido #{item.id}</Text>
            <Text style={{ color: COLORS.orange, marginTop: 4 }}>{item.status}</Text>
            <Text style={{ color: COLORS.greenDark, marginTop: 4 }}>
              R$ {item.total}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

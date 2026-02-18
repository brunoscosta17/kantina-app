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
import { SafeAreaView, Text } from 'react-native';

export default function OrdersScreen() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text>Pedidos</Text>
    </SafeAreaView>
  );
}

// import { useEffect, useState } from 'react';
// import { FlatList, SafeAreaView, Text, View } from 'react-native';
// import { getCatalog } from '../../services/catalog';

// export default function CatalogScreen() {
//   const [items, setItems] = useState<any[]>([]);
//   useEffect(() => { getCatalog().then(setItems).catch(console.error); }, []);
//   return (
//     <SafeAreaView style={{ flex: 1, padding: 16 }}>
//       <FlatList
//         data={items}
//         keyExtractor={(i) => i.id}
//         renderItem={({ item }) => (
//           <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
//             <Text style={{ fontWeight: '600' }}>{item.name}</Text>
//             <Text>R$ {(item.priceCents/100).toFixed(2)}</Text>
//             <Text style={{ color: '#666' }}>{item.category?.name}</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

import { FlatList, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../../../theme';

export default function CatalogScreen() {
  // Mock de dados e função de clique
  const items = [
    { id: '1', name: 'Coxinha', description: 'Frango com catupiry', price: '6.00' },
    { id: '2', name: 'Suco', description: 'Laranja natural', price: '4.00' },
  ];
  const onProductPress = (item: any) => {};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
        <FlatList
          ListHeaderComponent={() => (
            <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700', marginBottom: 12 }}>
              Catálogo
            </Text>
          )}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Button
              mode="outlined"
              style={{
                backgroundColor: '#fff',
                borderColor: COLORS.green,
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              labelStyle={{ color: COLORS.text, fontWeight: '600', fontSize: 16 }}
              onPress={() => onProductPress(item)}
            >
              {item.name}
              {"\n"}
              <Text style={{ color: '#666', marginTop: 4 }}>{item.description}</Text>
              {"\n"}
              <Text style={{ color: COLORS.greenDark, marginTop: 4 }}>
                R$ {item.price}
              </Text>
            </Button>
          )}
        />
    </SafeAreaView>
  );
}

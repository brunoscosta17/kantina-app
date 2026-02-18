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

import { SafeAreaView, Text } from 'react-native';

export default function CatalogScreen() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text>Catálogo</Text>
    </SafeAreaView>
  );
}

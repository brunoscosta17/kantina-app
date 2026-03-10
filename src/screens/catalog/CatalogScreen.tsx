import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../theme';
import { getCatalog, type CatalogItem } from '../../services/catalog';

export default function CatalogScreen() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCatalog();
        if (mounted) {
          setItems(data);
        }
      } catch (e) {
        console.error('Erro ao carregar catálogo', e);
        if (mounted) setError('Falha ao carregar catálogo.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      ) : items.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="food-outline" size={64} color="#ccc" />
          <Text style={{ color: COLORS.textVariant, marginTop: 16 }}>Nenhum produto encontrado no catálogo.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
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
            >
              <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
              {item.category && (
                <Text style={{ color: '#666', marginTop: 2 }}>{item.category.name}</Text>
              )}
              <Text style={{ color: COLORS.greenDark, marginTop: 4, fontWeight: '700' }}>
                R$ {(item.priceCents / 100).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

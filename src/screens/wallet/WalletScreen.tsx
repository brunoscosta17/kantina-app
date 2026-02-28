import { SafeAreaView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS } from '../../../theme';

export default function WalletScreen() {
  // Exemplo de saldo e função de adicionar crédito
  const balance = 100.0;
  const onAddCredit = () => {};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, padding: 16 }}>
      {/* Título removido, apenas conteúdo */}
      <View style={{ marginBottom: 12 }}>
        {/* <Text style={{ color: COLORS.orange, fontSize: 28, fontWeight: '700' }}>
          Carteira
        </Text> */}
      </View>
      <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.greenDark }}>
          R$ {balance}
        </Text>
        <Text style={{ color: COLORS.text, marginTop: 4 }}>Saldo disponível</Text>
      </View>
      <Button mode="contained" style={{ backgroundColor: COLORS.greenDark }} onPress={onAddCredit}>
        Adicionar crédito
      </Button>
    </SafeAreaView>
  );
}

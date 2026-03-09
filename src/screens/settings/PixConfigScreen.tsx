import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../../theme';

type PixConfig = {
  pixProvider?: string | null;
  pixKey?: string | null;
  gerencianetClientId?: string | null;
  gerencianetClientSecret?: string | null;
  mercadopagoAccessToken?: string | null;
  mercadopagoPublicKey?: string | null;
  minChargeCents?: number | null;
};

type PixConfigScreenProps = {
  onSave?: (data: PixConfig) => void;
  initial?: PixConfig;
  onCancel?: () => void;
};

export default function PixConfigScreen({ onSave, initial, onCancel }: PixConfigScreenProps) {
  const [provider, setProvider] = useState('mercadopago');
  const [mpAccessToken, setMpAccessToken] = useState(initial?.mercadopagoAccessToken ?? '');
  const [mpPublicKey, setMpPublicKey] = useState(initial?.mercadopagoPublicKey ?? '');
  const [minCharge, setMinCharge] = useState(
    typeof initial?.minChargeCents === 'number' ? (initial!.minChargeCents / 100).toFixed(2) : '0.00',
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 }}>
         <Text style={{ marginBottom: 16, color: COLORS.text, fontSize: 13, lineHeight: 20 }}>
          O Mercado Pago já está selecionado como provedor Pix recomendado. Insira suas credenciais de produção para receber pagamentos direto na sua conta.
        </Text>
        <TextInput 
          mode="outlined" 
          label="Access Token (Produção)" 
          value={mpAccessToken} 
          onChangeText={setMpAccessToken} 
          style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }} 
          secureTextEntry 
          theme={{ colors: { primary: COLORS.greenDark } }}
        />
        <TextInput 
          mode="outlined" 
          label="Public Key" 
          value={mpPublicKey} 
          onChangeText={setMpPublicKey} 
          style={{ marginBottom: 16, backgroundColor: '#FFFFFF' }} 
          theme={{ colors: { primary: COLORS.greenDark } }}
        />
        
        <TextInput
          mode="outlined"
          label="Valor mínimo de recarga (R$)"
          value={minCharge}
          onChangeText={setMinCharge}
          keyboardType="numeric"
          style={{ marginBottom: 8, backgroundColor: '#FFFFFF' }}
          theme={{ colors: { primary: COLORS.greenDark } }}
        />
      </View>
      
      <Button
        mode="contained"
        style={{ backgroundColor: COLORS.greenDark, paddingVertical: 6, borderRadius: 8 }}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        onPress={() =>
          onSave?.({
            pixProvider: provider,
            mercadopagoAccessToken: mpAccessToken,
            mercadopagoPublicKey: mpPublicKey,
            minChargeCents: Math.round(Number(minCharge.replace(',', '.')) * 100) || 0,
          })
        }
      >
        Salvar Configurações
      </Button>
      {onCancel && (
        <Button
          mode="text"
          onPress={onCancel}
          style={{ marginTop: 8 }}
          textColor={COLORS.orange}
        >
          Cancelar
        </Button>
      )}
    </ScrollView>
  );
}

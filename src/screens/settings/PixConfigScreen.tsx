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
  const [provider, setProvider] = useState('gerencianet');
  const [pixKey, setPixKey] = useState(initial?.pixKey ?? '');
  const [gnClientId, setGnClientId] = useState(initial?.gerencianetClientId ?? '');
  const [gnClientSecret, setGnClientSecret] = useState(initial?.gerencianetClientSecret ?? '');
  const [mpAccessToken, setMpAccessToken] = useState(initial?.mercadopagoAccessToken ?? '');
  const [mpPublicKey, setMpPublicKey] = useState(initial?.mercadopagoPublicKey ?? '');
  const [minCharge, setMinCharge] = useState(
    typeof initial?.minChargeCents === 'number' ? (initial!.minChargeCents / 100).toFixed(2) : '0.00',
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.orange, marginBottom: 16 }}>Configuração Pix</Text> */}
      <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: COLORS.text }}>Selecione o provedor Pix:</Text>
      <RadioButton.Group onValueChange={setProvider} value={provider}>
        <View style={{ gap: 4, marginBottom: 16 }}>
          <RadioButton.Item label="Mercado Pago (Recomendado)" value="mercadopago" labelStyle={{ color: COLORS.text }} />
          <RadioButton.Item label="Efí (Gerencianet)" value="gerencianet" labelStyle={{ color: COLORS.textVariant }} />
        </View>
      </RadioButton.Group>

      {provider === 'mercadopago' && (
        <View style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
           <Text style={{ marginBottom: 12, color: COLORS.textVariant, fontSize: 13 }}>
            Insira suas credenciais de produção do Mercado Pago para receber pagamentos Pix diretos na sua conta.
          </Text>
          <TextInput mode="outlined" label="Access Token" value={mpAccessToken} onChangeText={setMpAccessToken} style={{ marginBottom: 12 }} secureTextEntry />
          <TextInput mode="outlined" label="Public Key" value={mpPublicKey} onChangeText={setMpPublicKey} style={{ marginBottom: 8 }} />
        </View>
      )}

      {provider === 'gerencianet' && (
        <View style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <TextInput mode="outlined" label="Chave Pix" value={pixKey} onChangeText={setPixKey} style={{ marginBottom: 12 }} />
          <TextInput mode="outlined" label="Client ID" value={gnClientId} onChangeText={setGnClientId} style={{ marginBottom: 12 }} />
          <TextInput mode="outlined" label="Client Secret" value={gnClientSecret} onChangeText={setGnClientSecret} style={{ marginBottom: 8 }} secureTextEntry />
        </View>
      )}

      <TextInput
        mode="outlined"
        label="Valor mínimo de recarga (R$)"
        value={minCharge}
        onChangeText={setMinCharge}
        keyboardType="numeric"
        style={{ marginBottom: 24 }}
      />
      
      <Button
        mode="contained"
        style={{ backgroundColor: COLORS.greenDark, paddingVertical: 6, borderRadius: 8 }}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        onPress={() =>
          onSave?.({
            pixProvider: provider,
            pixKey,
            gerencianetClientId: gnClientId,
            gerencianetClientSecret: gnClientSecret,
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

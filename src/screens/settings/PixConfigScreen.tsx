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
      <Text style={{ marginBottom: 8 }}>Selecione o provedor Pix:</Text>
      <RadioButton.Group onValueChange={setProvider} value={provider}>
        <View style={{ gap: 4 }}>
          <RadioButton.Item label="Gerencianet" value="gerencianet" />
          <RadioButton.Item label="Mercado Pago" value="mercadopago" />
        </View>
      </RadioButton.Group>
      <TextInput label="Chave Pix" value={pixKey} onChangeText={setPixKey} style={{ marginBottom: 16 }} />
      {provider === 'gerencianet' && (
        <>
          <TextInput label="Client ID (Gerencianet)" value={gnClientId} onChangeText={setGnClientId} style={{ marginBottom: 8 }} />
          <TextInput label="Client Secret (Gerencianet)" value={gnClientSecret} onChangeText={setGnClientSecret} style={{ marginBottom: 16 }} />
        </>
      )}
      {provider === 'mercadopago' && (
        <>
          <TextInput label="Access Token (Mercado Pago)" value={mpAccessToken} onChangeText={setMpAccessToken} style={{ marginBottom: 8 }} />
          <TextInput label="Public Key (Mercado Pago)" value={mpPublicKey} onChangeText={setMpPublicKey} style={{ marginBottom: 16 }} />
        </>
      )}
      <TextInput
        label="Valor mínimo de recarga (R$)"
        value={minCharge}
        onChangeText={setMinCharge}
        keyboardType="numeric"
        style={{ marginBottom: 16 }}
      />
      <Button
        mode="contained"
        style={{ backgroundColor: COLORS.greenDark }}
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
        Salvar
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

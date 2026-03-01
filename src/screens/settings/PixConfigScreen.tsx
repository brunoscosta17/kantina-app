import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../../theme';

export default function PixConfigScreen({ onSave }: { onSave?: (data: any) => void }) {
  const [provider, setProvider] = useState('gerencianet');
  const [pixKey, setPixKey] = useState('');
  const [gnClientId, setGnClientId] = useState('');
  const [gnClientSecret, setGnClientSecret] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [mpPublicKey, setMpPublicKey] = useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.orange, marginBottom: 16 }}>Configuração Pix</Text>
      <Text style={{ marginBottom: 8 }}>Selecione o provedor Pix:</Text>
      <RadioButton.Group onValueChange={setProvider} value={provider}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
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
      <Button mode="contained" style={{ backgroundColor: COLORS.greenDark }} onPress={() => onSave?.({ provider, pixKey, gnClientId, gnClientSecret, mpAccessToken, mpPublicKey })}>
        Salvar
      </Button>
    </ScrollView>
  );
}

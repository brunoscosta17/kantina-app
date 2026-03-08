import React, { useState } from 'react';
import { Image, Modal, View, Alert } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../../../theme';

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, '');
  const number = Number(digits) / 100;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function PixChargeModal({ visible, onClose, onCharge, charge, student, minChargeCents = 0 }: {
  visible: boolean;
  onClose: () => void;
  onCharge: (valueCents: number, method: 'pix' | 'card') => void;
  charge?: any;
  student?: any;
  minChargeCents?: number;
}) {
  const [value, setValue] = useState('');
  const [method, setMethod] = useState<'pix' | 'card'>('pix');

  const handleChangeValue = (text: string) => {
    setValue(text.replace(/\D/g, ''));
  };

  const handleCopy = async () => {
    if (charge?.pixCopiaCola) {
      await Clipboard.setStringAsync(charge.pixCopiaCola);
      Alert.alert('Código Copiado!', 'O código Pix (Copia e Cola) foi enviado para sua área de transferência.');
    }
  };

  const valueCents = Number(value);
  const isValid = valueCents >= (minChargeCents ?? 0);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 360, elevation: 10 }}>
          
          <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.orange, marginBottom: 8, textAlign: 'center' }}>Adicionar saldo</Text>
          {student && (
            <Text style={{ fontSize: 15, color: COLORS.textVariant, marginBottom: 20, textAlign: 'center', fontWeight: '500' }}>
              Carteira do aluno: <Text style={{ color: COLORS.text, fontWeight: '700' }}>{student.name}</Text>
            </Text>
          )}

          {!charge ? (
            <>
              <Text style={{ marginBottom: 12, fontWeight: '600', color: COLORS.text }}>Selecione a forma de pagamento:</Text>
              
              <RadioButton.Group onValueChange={(v: string) => setMethod(v as 'pix' | 'card')} value={method}>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                  <RadioButton.Item label="Pix" value="pix" labelStyle={{ color: COLORS.text }} />
                </View>
              </RadioButton.Group>
              
              <TextInput
                mode="outlined"
                label={`Valor (R$) - mínimo ${(minChargeCents/100).toFixed(2)}`}
                value={formatCurrency(value)}
                onChangeText={handleChangeValue}
                keyboardType="numeric"
                style={{ marginBottom: 24 }}
                maxLength={10}
              />
              
              <Button
                mode="contained"
                style={{ backgroundColor: COLORS.greenDark, paddingVertical: 6, borderRadius: 8, marginBottom: 8 }}
                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                onPress={() => onCharge(valueCents, method)}
                disabled={!isValid}
              >
                Gerar Cobrança Pix
              </Button>
              <Button mode="text" onPress={onClose} textColor={COLORS.textVariant}>Cancelar</Button>
            </>
          ) : method === 'pix' ? (
            <>
              <Text style={{ marginBottom: 16, textAlign: 'center', color: COLORS.textVariant, fontSize: 14 }}>
                Escaneie o QR Code abaixo pelo app do seu banco ou copie o código Pix.
              </Text>

              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#eee' }}>
                  <Image source={{ uri: charge.qrCodeImageUrl }} style={{ width: 220, height: 220 }} />
                </View>
              </View>

              <Button
                mode="contained"
                icon="content-copy"
                onPress={handleCopy}
                style={{ backgroundColor: COLORS.orange, marginBottom: 12, paddingVertical: 6, borderRadius: 8 }}
                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
              >
                Copiar código Pix
              </Button>
              
              <Button mode="outlined" onPress={onClose} textColor={COLORS.textVariant} style={{ borderRadius: 8, borderColor: '#eee' }}>
                Fechar
              </Button>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

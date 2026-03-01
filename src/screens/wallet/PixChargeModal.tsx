import React, { useState } from 'react';
import { Image, Modal, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../../theme';

export default function PixChargeModal({ visible, onClose, onCharge, charge, student }: {
  visible: boolean;
  onClose: () => void;
  onCharge: (valueCents: number, method: 'pix' | 'card') => void;
  charge?: any;
  student?: any;
}) {
  const [value, setValue] = useState('');
  const [method, setMethod] = useState<'pix' | 'card'>('pix');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.orange, marginBottom: 12 }}>Adicionar saldo</Text>
          {student && (
            <Text style={{ fontSize: 16, color: COLORS.text, marginBottom: 8, fontWeight: '600' }}>
              Aluno: {student.name}
            </Text>
          )}
          {!charge ? (
            <>
              <Text style={{ marginBottom: 8 }}>Selecione o método de pagamento:</Text>
              <RadioButton.Group onValueChange={v => setMethod(v as 'pix' | 'card')} value={method}>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8, paddingLeft: 0 }}>
                  <RadioButton.Item label="Pix" value="pix" style={{ paddingLeft: 0 }} />
                  <RadioButton.Item label="Cartão de Crédito" value="card" style={{ paddingLeft: 0 }} />
                </View>
              </RadioButton.Group>
              <TextInput
                label="Valor (R$)"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                style={{ marginBottom: 16 }}
              />
              <Button mode="contained" style={{ backgroundColor: COLORS.greenDark }} onPress={() => onCharge(Math.round(Number(value.replace(/\D/g, '')) * 100), method)}>
                Gerar cobrança
              </Button>
              <Button onPress={onClose} style={{ marginTop: 8 }}>Cancelar</Button>
            </>
          ) : method === 'pix' ? (
            <>
              <Text style={{ marginBottom: 8 }}>Escaneie o QR Code Pix abaixo ou copie o código para pagar:</Text>
              <Image source={{ uri: charge.qrCodeImageUrl }} style={{ width: 180, height: 180, marginBottom: 8 }} />
              <Text selectable style={{ fontSize: 13, color: COLORS.text, marginBottom: 8 }}>{charge.pixCopiaCola}</Text>
              <Button onPress={onClose} style={{ marginTop: 8 }}>Fechar</Button>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 8 }}>Fluxo de cartão de crédito em breve!</Text>
              <Button onPress={onClose} style={{ marginTop: 8 }}>Fechar</Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

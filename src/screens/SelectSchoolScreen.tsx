import axios from 'axios';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../store/auth';

export default function SelectSchoolScreen() {
  const resolveTenant = useAuth((s) => s.resolveTenant);

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const codeError = useMemo(() => {
    const v = code.trim();
    if (!v) return 'Informe o código da escola';
    if (!/^\d{6}$/.test(v)) return 'Use 6 dígitos (ex: 000000)';
    return '';
  }, [code]);

  const canSubmit = !loading && !codeError;

  async function onContinue() {
    if (!canSubmit) return;
    setErr(null);

    try {
      setLoading(true);
      await resolveTenant(code.trim());
      // Navegação é automática pelo AppNavigator (tenantId preenchido)
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const data: any = e.response?.data;
        const msg = data?.message || data?.error;

        if (status === 404) setErr(msg || 'Escola não encontrada (404).');
        else if (status) setErr(msg || `Falha ao acessar (${status}).`);
        else setErr('Sem conexão com a API. Verifique o endereço do servidor.');
      } else {
        setErr('Não foi possível validar a escola. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Digite o código da escola</Text>
          <Text style={styles.subtitle}>
            Use o código fornecido pela administração (ex: 000000).
          </Text>

          <TextInput
            mode="outlined"
            label="Código da escola"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            error={!!codeError}
            style={styles.input}
          />
          <HelperText type={codeError ? 'error' : 'info'} visible>
            {codeError || ' '}
          </HelperText>

          <HelperText type={err ? 'error' : 'info'} visible>
            {err || ' '}
          </HelperText>

          <Button
            mode="contained"
            onPress={onContinue}
            loading={loading}
            disabled={!canSubmit}
            style={styles.btn}
            contentStyle={{ height: 48 }}
          >
            Continuar
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#6B7280', marginBottom: 16 },
  input: { backgroundColor: 'white' },
  btn: { marginTop: 10, borderRadius: 14 },
});

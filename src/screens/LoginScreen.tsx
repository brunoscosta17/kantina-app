import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const [tenant, setTenant] = useState('default');
  const [email, setEmail] = useState('admin@local.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const login = useAuth((s) => s.login);

  async function onLogin() {
    if (loading) return;
    setLoading(true);
    try {
      await login(tenant.trim(), email.trim().toLowerCase(), password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20, justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ gap: 14 }}>
        <Text variant="headlineMedium" style={{ fontWeight: '700' }}>
          Entrar
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
          Acesse sua conta para continuar.
        </Text>

        <TextInput
          mode="outlined"
          label="Tenant"
          value={tenant}
          onChangeText={setTenant}
          autoCapitalize="none"
        />

        <TextInput
          mode="outlined"
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          mode="outlined"
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button mode="contained" onPress={onLogin} loading={loading} disabled={loading}>
          Entrar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

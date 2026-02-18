// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const [tenant, setTenant] = useState('default');
  const [email, setEmail] = useState('admin@local.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const login = useAuth((s) => s.login);

  async function onLogin() {
    try {
      if (!tenant?.trim()) return Alert.alert('Informe o Tenant ID');
      if (!email?.trim()) return Alert.alert('Informe o e-mail');
      if (!password) return Alert.alert('Informe a senha');

      setLoading(true);
      await login(tenant.trim(), email.trim().toLowerCase(), password);
    } catch (err: any) {
      Alert.alert('Erro ao logar', err?.response?.data?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Entrar</Text>

      <Text style={{ fontWeight: '600' }}>Tenant ID</Text>
      <TextInput
        value={tenant}
        onChangeText={setTenant}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="default"
        editable={!loading}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <Text style={{ fontWeight: '600' }}>E-mail</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="admin@local.com"
        editable={!loading}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <Text style={{ fontWeight: '600' }}>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="123456"
        editable={!loading}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <View style={{ height: 12 }} />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={onLogin} disabled={loading} />
    </SafeAreaView>
  );
}

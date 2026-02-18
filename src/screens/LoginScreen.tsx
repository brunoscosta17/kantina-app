import { useState } from 'react';
import { Button, H2, Input, Paragraph, YStack } from 'tamagui';
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
    <YStack f={1} jc="center" p="$5" gap="$4">
      <YStack gap="$2">
        <H2>Entrar</H2>
        <Paragraph opacity={0.7}>Acesse sua conta para continuar.</Paragraph>
      </YStack>

      <Input value={tenant} onChangeText={setTenant} placeholder="Tenant (default)" autoCapitalize="none" />
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry />

      <Button onPress={onLogin} disabled={loading} theme="active">
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </YStack>
  );
}

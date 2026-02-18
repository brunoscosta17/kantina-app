import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const [tenant, setTenant] = useState('default');
  const [email, setEmail] = useState('admin@local.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const login = useAuth((s) => s.login);

  async function onLogin() {
    if (loading) return;

    const t = tenant.trim();
    const e = email.trim().toLowerCase();
    const p = password;

    if (!t) return Alert.alert('Informe o Tenant');
    if (!e) return Alert.alert('Informe o e-mail');
    if (!p) return Alert.alert('Informe a senha');

    try {
      setLoading(true);
      await login(t, e, p);
    } catch (err: any) {
      Alert.alert('Erro ao logar', err?.response?.data?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#0EA5E9', '#6366F1']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Bem-vindo. Faça login para continuar.</Text>

          <Text style={styles.label}>Tenant</Text>
          <TextInput
            value={tenant}
            onChangeText={setTenant}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            editable={!loading}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
            editable={!loading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <TouchableOpacity
            onPress={onLogin}
            disabled={loading}
            style={[styles.button, loading && { opacity: 0.7 }]}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Tenant padrão: <Text style={{ fontWeight: '800' }}>default</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { marginTop: 6, opacity: 0.7, marginBottom: 14 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  button: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontWeight: '800', fontSize: 16 },
  hint: { textAlign: 'center', marginTop: 12, opacity: 0.7 },
});

import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import { Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../store/auth';

// Ajuste o caminho conforme seu projeto
const logo = require('../../assets/kantina-logo.jpeg');

const COLORS = {
  green: '#80B990',
  greenDark: '#4E8D63',
  orange: '#E26509',
  cream: '#EEE6DA',
  white: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
};

export default function LoginScreen() {
  const login = useAuth((s) => s.login);
  const tenantName = useAuth((s) => s.tenantName);
  const tenantCode = useAuth((s) => s.tenantCode);
  const logout = useAuth((s) => s.logout);

  const [email, setEmail] = useState('admin@local.com');
  const [password, setPassword] = useState('123456');

  const [remember, setRemember] = useState(true);
  const [secure, setSecure] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // No dynamic logo calculations needed anymore.

  const emailError = useMemo(() => {
    const v = email.trim();
    if (!v) return 'Informe o e-mail';
    if (!v.includes('@')) return 'E-mail inválido';
    return '';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return 'Informe a senha';
    return '';
  }, [password]);

  async function handleLogin() {
    if (loading) return;

    const e = email.trim().toLowerCase();
    const p = password;

    // mesmas travas do antigo
    if (!e || emailError) return;
    if (!p) return;

    setLoginError(null);

    try {
      setLoading(true);
      console.log('[LOGIN] school=', tenantCode, tenantName, 'email=', e);
      await login(e, p);
      // redirecionamento continua sendo automático pelo AppNavigator (token)
    } catch (err: unknown) {
      // log no console para depuração
      console.log('LOGIN ERROR:', err);

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        // tenta extrair mensagem padrão de APIs (ajuste chaves se sua API usa outra)
        const data: any = err.response?.data;
        const apiMsg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(', ') : null);
        alert(JSON.stringify(data, null, 2));
        // mensagens mais úteis por status
        if (status === 401) {
          setLoginError(apiMsg || 'Credenciais inválidas (401).');
        } else if (status === 404) {
          setLoginError(apiMsg || 'Endpoint não encontrado (404).');
        } else if (status) {
          setLoginError(apiMsg || `Falha ao acessar (${status}).`);
        } else {
          // sem response => geralmente rede / API offline / baseURL errada
          setLoginError('Sem conexão com a API. Verifique a rede e o endereço do servidor.');
        }
      } else {
        setLoginError('Não foi possível acessar. Verifique seus dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleStudentAccess() {
    // placeholder (mantém layout)
    setLoginError('Acesso do Aluno: implemente a navegação/fluxo aqui.');
  }

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoTranslate]);

  return (
    <View style={styles.root}>
      {/* Fundo (topo verde + base cream) */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Logo */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.logoWrap,
                { opacity: logoOpacity, transform: [{ translateY: logoTranslate }] },
              ]}
            >
              <Image source={logo} style={styles.logo} resizeMode="cover" />
            </Animated.View>
          </View>

          <View style={styles.card}>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '600', marginTop: 12 }}>Escola</Text>
              <Text style={{ color: '#666' }}>
                {tenantName ?? '(não definido)'} {tenantCode ? `• ${tenantCode}` : ''}
              </Text>

              <Button
                mode="text"
                onPress={() => logout({ clearTenant: true })}
                disabled={loading}
                style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }}
              >
                Trocar escola
              </Button>
            </View>
            {/* Email */}
            <TextInput
              mode="outlined"
              label="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" />}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.greenDark}
              textColor={COLORS.text}
              theme={{ colors: { primary: COLORS.greenDark } }}
              editable={!loading}
              error={!!emailError}
            />
            <HelperText type={emailError ? 'error' : 'info'} visible>
              {emailError || ' '}
            </HelperText>

            {/* Senha */}
            <TextInput
              mode="outlined"
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setSecure((s) => !s)}
                />
              }
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.greenDark}
              textColor={COLORS.text}
              theme={{ colors: { primary: COLORS.greenDark } }}
              editable={!loading}
              error={!!passwordError}
            />
            <HelperText type={passwordError ? 'error' : 'info'} visible>
              {passwordError || ' '}
            </HelperText>

            {/* Remember */}
            <View style={styles.rememberRow}>
              <View style={styles.rememberLeft}>
                <Checkbox
                  status={remember ? 'checked' : 'unchecked'}
                  onPress={() => setRemember((r) => !r)}
                  color={COLORS.greenDark}
                  disabled={loading}
                />
                <Text style={styles.rememberText}>Salvar dados de acesso?</Text>
              </View>
            </View>

            {/* Erro de login (API) */}
            <View style={styles.errorSlot}>
              <Text style={styles.errorText} numberOfLines={2}>
                {loginError || ' '}
              </Text>
            </View>

            {/* Buttons */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.primaryBtn}
              contentStyle={styles.btnContent}
              buttonColor={COLORS.greenDark}
              textColor={COLORS.white}
            >
              Acessar
            </Button>

            <Button
              mode="contained-tonal"
              onPress={handleStudentAccess}
              style={styles.secondaryBtn}
              contentStyle={styles.btnContent}
              buttonColor={COLORS.orange}
              textColor={COLORS.white}
              disabled={loading}
            >
              Acesso do Aluno
            </Button>

            {/* Links */}
            <View style={styles.links}>
              <Text style={styles.link}>
                Não possui uma conta? <Text style={styles.linkStrong}>Cadastre-se</Text>
              </Text>
              <Text style={styles.link}>
                Esqueceu a senha? <Text style={styles.linkStrong}>Clique aqui</Text>
              </Text>
            </View>

            {/* Footer row */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Versão 1.0.0</Text>
              <Text style={styles.footerText}>PT</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: COLORS.greenDark,
  },

  bgBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '45%',
    backgroundColor: COLORS.cream,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },

  logoWrap: {
    borderRadius: 80,
    backgroundColor: '#F5EBE0', // Fundo que mescla bem com a imagem
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 4,
    borderColor: COLORS.white,
    overflow: 'hidden', // Corta a imagem quadrada em um círculo perfeito
  },

  logo: {
    width: 150,
    height: 150,
  },

  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  input: {
    marginBottom: 0,
    backgroundColor: COLORS.white,
  },

  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },

  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rememberText: {
    color: COLORS.muted,
    fontSize: 13,
  },

  errorSlot: {
    minHeight: 40,          // espaço reservado (não “pula”)
    justifyContent: 'center',
    marginBottom: 6,
  },

  errorText: {
    color: '#B91C1C',
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'center',
  },

  primaryBtn: {
    borderRadius: 14,
    marginTop: 2,
  },

  secondaryBtn: {
    borderRadius: 14,
    marginTop: 10,
  },

  btnContent: {
    height: 48,
  },

  links: {
    marginTop: 14,
    gap: 6,
  },

  link: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 13,
  },

  linkStrong: {
    color: COLORS.orange,
    fontWeight: '700',
  },

  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerText: {
    flex: 1,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
  },
});

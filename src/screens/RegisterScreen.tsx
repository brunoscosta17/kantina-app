import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import api from '../lib/api';
import { useAuth } from '../store/auth';
import pkg from '../../package.json';

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

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const tenantCode = useAuth((s) => s.tenantCode);
  const tenantName = useAuth((s) => s.tenantName);
  const tenantId = useAuth((s) => s.tenantId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const emailError = useMemo(() => {
    const v = email.trim();
    if (!v) return 'Informe o e-mail';
    if (!v.includes('@')) return 'E-mail inválido';
    return '';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return 'Informe a senha';
    if (password.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
    return '';
  }, [password]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return 'Confirme a senha';
    if (confirmPassword !== password) return 'As senhas não coincidem';
    return '';
  }, [password, confirmPassword]);

  async function handleRegister() {
    if (loading || success) return;

    if (!email.trim() || emailError) return;
    if (!password || passwordError) return;
    if (!confirmPassword || confirmPasswordError) return;

    setRegisterError(null);

    try {
      setLoading(true);
      await api.post('/auth/register', {
        email: email.trim().toLowerCase(),
        password: password,
      }, {
        headers: { 'x-tenant': tenantId },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
      
    } catch (err: any) {
      console.log('REGISTER ERROR:', err);
      const apiMsg = err.response?.data?.message || err.response?.data?.error;
      setRegisterError(apiMsg || 'Falha ao criar conta. Verifique os dados ou se o e-mail já existe.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
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
              <Text style={{ fontWeight: '600', marginTop: 0, fontSize: 18, color: COLORS.greenDark, textAlign: 'center' }}>
                Criar Nova Conta
              </Text>
              <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
                {tenantName} {tenantCode ? `• ${tenantCode}` : ''}
              </Text>
            </View>

            {success ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: COLORS.greenDark, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                  Conta criada com sucesso!
                </Text>
                <Text style={{ color: COLORS.text, textAlign: 'center', marginTop: 10 }}>
                  Redirecionando para o login...
                </Text>
              </View>
            ) : (
              <>
                <TextInput
                  mode="outlined"
                  label="E-mail"
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
                  error={!!emailError && email.length > 0}
                />
                
                <HelperText type={emailError ? 'error' : 'info'} visible={email.length > 0}>
                  {emailError || ' '}
                </HelperText>

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
                  error={!!passwordError && password.length > 0}
                />
                <HelperText type={passwordError ? 'error' : 'info'} visible={password.length > 0}>
                  {passwordError || ' '}
                </HelperText>

                <TextInput
                  mode="outlined"
                  label="Confirmar Senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={secure}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-check-outline" />}
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.greenDark}
                  textColor={COLORS.text}
                  theme={{ colors: { primary: COLORS.greenDark } }}
                  editable={!loading}
                  error={!!confirmPasswordError && confirmPassword.length > 0}
                />
                <HelperText type={confirmPasswordError ? 'error' : 'info'} visible={confirmPassword.length > 0}>
                  {confirmPasswordError || ' '}
                </HelperText>

                <View style={styles.errorSlot}>
                  <Text style={styles.errorText} numberOfLines={2}>
                    {registerError || ' '}
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  style={styles.primaryBtn}
                  contentStyle={styles.btnContent}
                  buttonColor={COLORS.greenDark}
                  textColor={COLORS.white}
                >
                  Cadastrar
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.secondaryBtn}
                  textColor={COLORS.orange}
                  disabled={loading}
                >
                  Voltar para o Login
                </Button>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Versão {pkg.version}</Text>
                  <Text style={styles.footerText}>PT</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: COLORS.cream },
  bgTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundColor: COLORS.greenDark },
  bgBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, top: '45%', backgroundColor: COLORS.cream },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, alignItems: 'center', justifyContent: 'center' },
  header: { width: '100%', alignItems: 'center', marginBottom: 28 },
  logoWrap: { borderRadius: 80, backgroundColor: '#F5EBE0', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 8, borderWidth: 4, borderColor: COLORS.white, overflow: 'hidden' },
  logo: { width: 150, height: 150 },
  card: { width: '100%', backgroundColor: COLORS.white, borderRadius: 22, padding: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  input: { marginBottom: 0, backgroundColor: COLORS.white },
  errorSlot: { minHeight: 40, justifyContent: 'center', marginBottom: 6 },
  errorText: { color: '#B91C1C', marginBottom: 0, fontSize: 13, textAlign: 'center' },
  primaryBtn: { borderRadius: 14, marginTop: 2 },
  secondaryBtn: { borderRadius: 14, marginTop: 10 },
  btnContent: { height: 48 },
  footerRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { flex: 1, textAlign: 'center', color: '#9CA3AF', fontSize: 12 },
});

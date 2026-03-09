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

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const tenantCode = useAuth((s) => s.tenantCode);
  const tenantName = useAuth((s) => s.tenantName);
  const tenantId = useAuth((s) => s.tenantId);

  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [recoverError, setRecoverError] = useState<string | null>(null);
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
    if (!v) return 'Informe o e-mail cadastrado';
    if (!v.includes('@')) return 'E-mail inválido';
    return '';
  }, [email]);

  async function handleRecoverPassword() {
    if (loading || success) return;

    if (!email.trim() || emailError) return;

    setRecoverError(null);

    try {
      setLoading(true);
      await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      }, {
        headers: { 'x-tenant': tenantId },
      });
      
      setSuccess(true);
      
    } catch (err: any) {
      console.log('RECOVER PASSWORD ERROR:', err);
      const apiMsg = err.response?.data?.message || err.response?.data?.error;
      setRecoverError(apiMsg || 'Falha ao solicitar recuperação de senha.');
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
                Recuperação de Senha
              </Text>
              <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
                {tenantName} {tenantCode ? `• ${tenantCode}` : ''}
              </Text>
            </View>

            {success ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: COLORS.greenDark, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                  E-mail enviado!
                </Text>
                <Text style={{ color: COLORS.text, textAlign: 'center', marginTop: 10 }}>
                  Se o e-mail existir na nossa base, você receberá um link com as instruções para redefinir sua senha.
                </Text>
                
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Login')}
                  style={[styles.primaryBtn, { marginTop: 30, width: '100%' }]}
                  contentStyle={styles.btnContent}
                  buttonColor={COLORS.greenDark}
                  textColor={COLORS.white}
                >
                  Voltar para o Login
                </Button>
              </View>
            ) : (
              <>
                <Text style={{ color: COLORS.muted, textAlign: 'center', marginBottom: 20, fontSize: 14 }}>
                  Informe o seu e-mail de acesso. Enviaremos um link para você escolher uma nova senha.
                </Text>
                
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

                <View style={styles.errorSlot}>
                  <Text style={styles.errorText} numberOfLines={2}>
                    {recoverError || ' '}
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleRecoverPassword}
                  loading={loading}
                  style={styles.primaryBtn}
                  contentStyle={styles.btnContent}
                  buttonColor={COLORS.greenDark}
                  textColor={COLORS.white}
                >
                  Enviar Link
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.secondaryBtn}
                  disabled={loading}
                >
                  <Text style={{ color: COLORS.muted }}>Lembrei minha senha! </Text>
                  <Text style={{ color: COLORS.orange, fontWeight: 'bold' }}>Voltar</Text>
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

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
import { useAuth } from '../store/auth';
import pkg from '../../package.json';
import axios from 'axios';

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

export default function StudentLoginScreen() {
  const navigation = useNavigation<any>();
  const studentLogin = useAuth((s) => s.studentLogin);
  const tenantName = useAuth((s) => s.tenantName);
  const tenantCode = useAuth((s) => s.tenantCode);

  const [accessCode, setAccessCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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

  const accessCodeError = useMemo(() => {
    const v = accessCode.trim();
    if (!v) return 'Informe o código de acesso';
    if (v.length !== 6) return 'O código possui 6 dígitos';
    return '';
  }, [accessCode]);

  async function handleLogin() {
    if (loading) return;
    if (!accessCode.trim() || accessCodeError) return;

    setLoginError(null);

    try {
      setLoading(true);
      await studentLogin(accessCode.trim());
    } catch (err: unknown) {
      console.log('STUDENT LOGIN ERROR:', err);
      if (axios.isAxiosError(err)) {
        const data: any = err.response?.data;
        const apiMsg = data?.message || data?.error;
        if (err.response?.status === 401) {
          setLoginError('Código inválido ou inexistente.');
        } else {
          setLoginError(apiMsg || 'Falha ao acessar a conta do aluno.');
        }
      } else {
        setLoginError('Ocorreu um erro ao tentar entrar.');
      }
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
                Acesso do Aluno
              </Text>
              <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
                {tenantName} {tenantCode ? `• ${tenantCode}` : ''}
              </Text>
            </View>

            <Text style={{ color: COLORS.muted, textAlign: 'center', marginBottom: 20, fontSize: 14 }}>
              Peça o código de 6 dígitos para o seu responsável e digite abaixo:
            </Text>
            
            <TextInput
              mode="outlined"
              label="Código de Acesso"
              value={accessCode}
              onChangeText={setAccessCode}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              left={<TextInput.Icon icon="dialpad" />}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.greenDark}
              textColor={COLORS.text}
              theme={{ colors: { primary: COLORS.greenDark } }}
              editable={!loading}
              error={!!accessCodeError && accessCode.length > 0}
            />
            
            <HelperText type={accessCodeError ? 'error' : 'info'} visible={accessCode.length > 0}>
              {accessCodeError || ' '}
            </HelperText>

            <View style={styles.errorSlot}>
              <Text style={styles.errorText} numberOfLines={2}>
                {loginError || ' '}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.primaryBtn}
              contentStyle={styles.btnContent}
              buttonColor={COLORS.greenDark}
              textColor={COLORS.white}
            >
              Entrar
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.secondaryBtn}
              textColor={COLORS.orange}
              disabled={loading}
            >
              Voltar ao Início
            </Button>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Versão {pkg.version}</Text>
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

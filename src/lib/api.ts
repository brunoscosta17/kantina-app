// src/lib/api.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envUrl = process.env.EXPO_PUBLIC_API_URL;

const extraUrl =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  undefined;


// Detecta ambiente web de desenvolvimento
const isWeb = Platform.OS === 'web';
const isDev = typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost';

// URL da API em produção (Railway)
const PROD_API_URL = 'https://kantina-api-production.up.railway.app';

let API_URL = envUrl;
if (!API_URL) {
  API_URL = extraUrl;
}

// Para web: se não houver env, cai para localhost em dev ou prod_url em prod
if (isWeb) {
  if (!API_URL) {
    API_URL = isDev ? 'http://localhost:3000' : PROD_API_URL;
  }
} else {
  // Para mobile (iOS/Android): sempre usa produção, a menos que explicitamente definido
  if (!API_URL) {
    API_URL = PROD_API_URL;
  }
}


export { API_URL };

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

console.log('[API_URL]', API_URL);

export default api;

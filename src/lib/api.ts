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

// URL da API Cloud Run
const PROD_API_URL = 'https://kantina-api-380728917745.southamerica-east1.run.app';

let API_URL = envUrl;
if (!API_URL) {
  API_URL = extraUrl;
}

// Para web: se dev, usa localhost; se não, usa produção
if (isWeb) {
  if (isDev) {
    API_URL = 'http://localhost:3000';
  } else {
    API_URL = PROD_API_URL;
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

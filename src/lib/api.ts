// src/lib/api.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 1) Preferência: EXPO_PUBLIC_API_URL (ótimo pra Expo Go / device físico)
// 2) Depois: app.json extra.apiUrl
// 3) Depois: defaults por plataforma (emulator/simulator)
const envUrl = process.env.EXPO_PUBLIC_API_URL;

const extraUrl =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  undefined;

export const API_URL =
  envUrl ??
  extraUrl ??
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:3000' // Android Emulator
    : 'http://localhost:3000'); // iOS Simulator

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

console.log('[API_URL]', API_URL);

export default api;

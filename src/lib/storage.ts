import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function getItemAsync(key: string) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

export async function setItemAsync(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return await SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return await SecureStore.deleteItemAsync(key);
}

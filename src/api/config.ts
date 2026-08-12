// Direccion del servidor (API)
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Intentamos sacar la IP de la PC desde Expo
function getHost() {
  // Expo a veces guarda la IP en hostUri
  var hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    null;

  if (hostUri) {
    // hostUri viene como "192.168.x.x:8081", solo queremos la IP
    return hostUri.split(':')[0];
  }

  // Si no hay IP, usamos valores por defecto
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
}

// URL base de la API
export const API_URL = 'http://' + getHost() + ':3001/api';

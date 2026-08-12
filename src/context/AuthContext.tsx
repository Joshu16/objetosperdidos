// Guarda el nombre del usuario en el telefono (no hay contrasena)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = '@objetosperdidos/userName';

type AuthContextValue = {
  userName: string | null;
  loading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al abrir la app, leemos si ya habia un nombre guardado
  useEffect(() => {
    async function leerNombre() {
      var valor = await AsyncStorage.getItem(STORAGE_KEY);
      setUserName(valor);
      setLoading(false);
    }
    leerNombre();
  }, []);

  // Guardar el nombre al "iniciar sesion"
  async function login(name: string) {
    var limpio = name.trim();
    if (!limpio) {
      throw new Error('Ingresa tu nombre');
    }
    await AsyncStorage.setItem(STORAGE_KEY, limpio);
    setUserName(limpio);
  }

  // Borrar el nombre al salir
  async function logout() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUserName(null);
  }

  return (
    <AuthContext.Provider value={{ userName, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el auth en cualquier pantalla
export function useAuth() {
  var ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}

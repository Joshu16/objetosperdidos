// Layout principal: navegacion y sesion
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Objetos perdidos' }} />
        <Stack.Screen
          name="upload"
          options={{ title: 'Subir objeto', presentation: 'modal' }}
        />
      </Stack>
    </AuthProvider>
  );
}

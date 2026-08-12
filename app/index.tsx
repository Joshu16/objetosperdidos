// Pantalla de login: solo pide el nombre
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { colors, radii, spacing } from '../src/constants/theme';

export default function LoginScreen() {
  const { userName, loading, login } = useAuth();
  const router = useRouter();

  // Estados del formulario
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Mientras carga el nombre guardado
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  // Si ya hay sesion, ir al home
  if (userName) {
    return <Redirect href="/home" />;
  }

  // Al presionar Continuar
  async function handleLogin() {
    try {
      setSubmitting(true);
      setError('');
      await login(name);
      router.replace('/home');
    } catch (e: any) {
      setError(e.message || 'Error al entrar');
    }
    setSubmitting(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.centerBlock}>
          <Text style={styles.brand}>Objetos Perdidos</Text>
          <Text style={styles.subtitle}>
            Reporta y encuentra objetos del colegio
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Tu nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. Ana Lopez"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              onPress={handleLogin}
              disabled={submitting}
              style={({ pressed }) => [
                styles.button,
                (pressed || submitting) && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>
                {submitting ? 'Entrando...' : 'Continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  centerBlock: {
    gap: spacing.sm,
  },
  brand: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    fontSize: 17,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: '600',
  },
});

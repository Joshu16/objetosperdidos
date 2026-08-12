// Pantalla para subir un objeto perdido (foto + datos)
import * as ImagePicker from 'expo-image-picker';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createItem } from '../src/api/items';
import { CategorySelect } from '../src/components/CategorySelect';
import { useAuth } from '../src/context/AuthContext';
import { colors, radii, spacing } from '../src/constants/theme';

export default function UploadScreen() {
  const { userName, loading: authLoading } = useAuth();
  const router = useRouter();

  // Datos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronica');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [submitting, setSubmitting] = useState(false);

  // Si no hay sesion, volver al login
  if (!authLoading && !userName) {
    return <Redirect href="/" />;
  }

  // Tomar foto con la camara
  async function takePhoto() {
    var permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Activa la camara para continuar.');
      return;
    }

    var result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });

    // Si el usuario no cancelo, guardamos la foto
    if (!result.canceled && result.assets[0]) {
      var asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 || null);
      setMimeType(asset.mimeType || 'image/jpeg');
    }
  }

  // Elegir foto de la galeria
  async function pickFromGallery() {
    var permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Activa el acceso a fotos para continuar.');
      return;
    }

    var result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      var asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 || null);
      setMimeType(asset.mimeType || 'image/jpeg');
    }
  }

  // Enviar el objeto al servidor
  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Falta el titulo', 'Escribe que objeto encontraste.');
      return;
    }
    if (!imageBase64) {
      Alert.alert('Falta la foto', 'Toma o selecciona una foto.');
      return;
    }
    if (!userName) {
      Alert.alert('Sesion', 'Vuelve a iniciar sesion.');
      return;
    }

    try {
      setSubmitting(true);
      await createItem({
        title: title.trim(),
        description: description.trim(),
        category: category,
        reportedBy: userName,
        imageBase64: imageBase64,
        imageMimeType: mimeType,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo subir');
    }
    setSubmitting(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Foto</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sin foto</Text>
          </View>
        )}

        <View style={styles.photoActions}>
          <Pressable style={styles.secondaryButton} onPress={takePhoto}>
            <Text style={styles.secondaryButtonText}>Tomar foto</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={pickFromGallery}>
            <Text style={styles.secondaryButtonText}>Galeria</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Titulo</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ej. Termo azul"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />

        <Text style={styles.label}>Descripcion (opcional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Donde se encontro, detalles..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, styles.multiline]}
          multiline
        />

        <CategorySelect selected={category} onSelect={setCategory} />

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={({ pressed }) => [
            styles.button,
            (pressed || submitting) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Subiendo...' : 'Subir objeto'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  placeholder: {
    width: '100%',
    height: 240,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 17,
    color: colors.text,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: spacing.lg,
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

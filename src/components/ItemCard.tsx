// Tarjeta de un objeto perdido en la lista
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LostItem } from '../types';
import { colors, radii, spacing } from '../constants/theme';
import { API_URL } from '../api/config';

type Props = {
  item: LostItem;
  onMarkFound: (id: string) => void;
};

// Arma la URL completa de la foto
function resolveImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  // Quitamos "/api" del final para apuntar a /uploads
  var base = API_URL.replace('/api', '');
  return base + imageUrl;
}

// Fecha legible para mostrar
function formatDate(value: string) {
  var date = new Date(value);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ItemCard({ item, onMarkFound }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: resolveImageUrl(item.imageUrl) }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.meta}>Reportado por {item.reportedBy}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => onMarkFound(item._id)}
        >
          <Text style={styles.buttonText}>Marcar como encontrado</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    paddingBottom: spacing.lg,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  body: {
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});

// Pantalla principal: lista de objetos perdidos
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { fetchItems, markItemFound } from '../src/api/items';
import { CategorySelect } from '../src/components/CategorySelect';
import { ItemCard } from '../src/components/ItemCard';
import { useAuth } from '../src/context/AuthContext';
import { colors, radii, spacing } from '../src/constants/theme';
import type { LostItem } from '../src/types';

export default function HomeScreen() {
  const { userName, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Estados de la pantalla
  const [items, setItems] = useState<LostItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar objetos desde el servidor
  async function loadItems(searchValue: string, categoryValue: string) {
    try {
      setLoading(true);
      setError('');
      var data = await fetchItems(searchValue, categoryValue);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    }
    setLoading(false);
  }

  // Cada vez que entramos a la pantalla (o cambia busqueda/categoria), recargamos
  useFocusEffect(
    useCallback(() => {
      var timer = setTimeout(function () {
        loadItems(search, category);
      }, 250);

      // Limpiar el timer al salir
      return function () {
        clearTimeout(timer);
      };
    }, [search, category]),
  );

  // Si no hay sesion, volver al login
  if (!authLoading && !userName) {
    return <Redirect href="/" />;
  }

  // Marcar un objeto como encontrado
  async function handleMarkFound(id: string) {
    try {
      await markItemFound(id);

      // Quitar el objeto de la lista en pantalla
      var nuevaLista = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i]._id !== id) {
          nuevaLista.push(items[i]);
        }
      }
      setItems(nuevaLista);
    } catch (e: any) {
      setError(e.message || 'No se pudo actualizar');
    }
  }

  // Cerrar sesion
  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userName}</Text>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </Pressable>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar objetos..."
        placeholderTextColor={colors.textSecondary}
        style={styles.search}
        returnKeyType="search"
        onSubmitEditing={() => loadItems(search, category)}
        clearButtonMode="while-editing"
      />

      <CategorySelect
        selected={category}
        onSelect={setCategory}
        includeAll
        label="Filtrar por categoria"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ItemCard item={item} onMarkFound={handleMarkFound} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay objetos perdidos por ahora</Text>
          }
          refreshing={loading}
          onRefresh={() => loadItems(search, category)}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/upload')}
      >
        <Text style={styles.fabText}>+ Subir objeto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  logout: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 17,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: colors.textSecondary,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fabPressed: {
    opacity: 0.9,
  },
  fabText: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: '600',
  },
});

// Selector de categoria (abre un modal con opciones)
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  selected: string;
  onSelect: (category: string) => void;
  includeAll?: boolean;
  label?: string;
};

export function CategorySelect({
  selected,
  onSelect,
  includeAll = false,
  label = 'Categoria',
}: Props) {
  const [open, setOpen] = useState(false);

  // Armamos la lista de opciones
  var options: string[] = [];
  if (includeAll) {
    options.push('Todas');
  }
  for (var i = 0; i < CATEGORIES.length; i++) {
    options.push(CATEGORIES[i]);
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.select, pressed && styles.selectPressed]}
      >
        <Text style={styles.selectValue}>{selected}</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                var active = item === selected;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {item}
                    </Text>
                    {active ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              }}
            />
            <Pressable style={styles.cancel} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  select: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectPressed: {
    opacity: 0.85,
  },
  selectValue: {
    fontSize: 17,
    color: colors.text,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '70%',
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  optionActive: {
    backgroundColor: colors.surface,
  },
  optionText: {
    fontSize: 17,
    color: colors.text,
  },
  optionTextActive: {
    fontWeight: '600',
  },
  check: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '700',
  },
  cancel: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
});

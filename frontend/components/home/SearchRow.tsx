import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SearchBar } from '@/components/home/SearchBar';
import { theme } from '@/constants/theme';

export function SearchRow() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SearchBar onPress={() => router.push('/search')} />
      <Pressable style={styles.filterButton} hitSlop={4}>
        <Ionicons name="options-outline" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

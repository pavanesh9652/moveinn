import { StyleSheet, Text, View } from 'react-native';

import type { WeekMenuDay } from '@/lib/propertyDetails';
import { theme } from '@/constants/theme';

type FoodTabProps = {
  menu: WeekMenuDay[];
};

export function FoodTab({ menu }: FoodTabProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This week&apos;s menu</Text>
      <View style={styles.list}>
        {menu.map((day) => (
          <View key={day.day} style={styles.card}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>{day.day}</Text>
            </View>
            <View style={styles.meals}>
              <MealRow label="Breakfast" value={day.breakfast} />
              <MealRow label="Lunch" value={day.lunch} />
              <MealRow label="Dinner" value={day.dinner} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <Text style={styles.mealLine}>
      <Text style={styles.mealLabel}>{label} </Text>
      <Text style={styles.mealValue}>{value}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dayBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  meals: {
    flex: 1,
    gap: 6,
  },
  mealLine: {
    fontSize: 13,
    lineHeight: 19,
  },
  mealLabel: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  mealValue: {
    color: theme.colors.textSecondary,
  },
});

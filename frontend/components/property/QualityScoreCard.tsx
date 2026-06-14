import { StyleSheet, Text, View } from 'react-native';

import type { QualityBreakdown } from '@/lib/propertyDetails';
import { theme } from '@/constants/theme';

type QualityScoreCardProps = {
  score: number;
  breakdown: QualityBreakdown[];
};

export function QualityScoreCard({ score, breakdown }: QualityScoreCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MoveInn Quality Score</Text>
          <Text style={styles.subtitle}>Based on verified resident reviews</Text>
        </View>
        <Text style={styles.score}>{score}/100</Text>
      </View>

      <View style={styles.grid}>
        {breakdown.map((item) => (
          <View key={item.label} style={styles.item}>
            <Text style={styles.itemScore}>{item.score.toFixed(1)}</Text>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryDark,
    gap: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  itemScore: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});

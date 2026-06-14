import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { PropertyReview, ReviewCategoryScore } from '@/lib/propertyDetails';
import { theme } from '@/constants/theme';

type ReviewsTabProps = {
  rating: number;
  reviewCount: number;
  categoryScores: ReviewCategoryScore[];
  reviews: PropertyReview[];
};

export function ReviewsTab({ rating, reviewCount, categoryScores, reviews }: ReviewsTabProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryScore}>{rating.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < Math.round(rating) ? 'star' : 'star-outline'}
                size={14}
                color={theme.colors.star}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
        </View>

        <View style={styles.summaryRight}>
          {categoryScores.map((item) => (
            <View key={item.label} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{item.label}</Text>
              <View style={styles.scoreBarTrack}>
                <View style={[styles.scoreBarFill, { width: `${item.score}%` }]} />
              </View>
              <Text style={styles.scoreValue}>{item.score}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.reviewList}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.authorRow}>
                <Text style={styles.author}>{review.author}</Text>
                {review.verified ? (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={theme.colors.verified} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.reviewMeta}>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < review.rating ? 'star' : 'star-outline'}
                      size={11}
                      color={theme.colors.star}
                    />
                  ))}
                </View>
                <Text style={styles.timeAgo}>{review.timeAgo}</Text>
              </View>
            </View>
            <Text style={styles.comment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
  },
  summaryScore: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  summaryRight: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    width: 72,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  scoreValue: {
    width: 24,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'right',
  },
  reviewList: {
    gap: theme.spacing.md,
  },
  reviewCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  reviewHeader: {
    gap: 6,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.verified,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  timeAgo: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  comment: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
});

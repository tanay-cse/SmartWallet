import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { BudgetSpace } from '../../types/budget';
import { WalletIcon } from '../icons/BudgetIcons';

type N26SpacesCarouselProps = {
  spaces: BudgetSpace[];
  onSelectSpace?: (space: BudgetSpace) => void;
};

export function N26SpacesCarousel({
  spaces,
  onSelectSpace,
}: N26SpacesCarouselProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Spaces & Sub-Accounts</Text>
          <Text style={styles.sectionSubtitle}>Automated allocations</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel with Minimalist Borderless Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {spaces.map((space) => {
          const formattedAmount = `${space.currency}${space.amount.toLocaleString(
            'en-US',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`;

          const progressPercent = space.targetAmount
            ? Math.min(100, Math.round((space.amount / space.targetAmount) * 100))
            : null;

          return (
            <TouchableOpacity
              key={space.id}
              style={styles.spaceCard}
              onPress={() => onSelectSpace?.(space)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.spaceIconCircle}>
                  <WalletIcon size={16} color={space.accentColor} />
                </View>
                {space.badge && (
                  <View style={styles.spaceBadge}>
                    <Text style={styles.badgeText}>{space.badge}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.spaceTitle}>{space.title}</Text>
              <Text style={styles.spaceSubtitle}>{space.subtitle}</Text>

              {/* Bold Coinbase Amount */}
              <Text style={styles.spaceAmount}>{formattedAmount}</Text>

              {/* Minimal Progress Bar if Target exists */}
              {progressPercent !== null && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progressPercent}%`,
                          backgroundColor: space.accentColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    ₹{space.targetAmount?.toLocaleString('en-IN')} target ({progressPercent}%)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.forestGreen,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  spaceCard: {
    width: 175,
    borderRadius: 18,
    padding: 16,
    backgroundColor: Colors.surfaceSubtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spaceIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  spaceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  spaceSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  spaceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { CategoryItem } from '../../types/budget';
import { CategoryIcon, ChevronRightIcon } from '../icons/BudgetIcons';

type CategoryBreakdownListProps = {
  categories: CategoryItem[];
  selectedCategoryId?: string | null;
  onSelectCategory: (category: CategoryItem) => void;
};

export function CategoryBreakdownList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryBreakdownListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>Tap to inspect</Text>
      </View>

      {/* Edge-to-Edge List */}
      <View style={styles.listContainer}>
        {categories.map((cat, index) => {
          const isSelected = selectedCategoryId === cat.id;
          const isLast = index === categories.length - 1;

          const formattedAmount = `₹${cat.amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;

          const percentSpentOfLimit = Math.round(
            (cat.amount / cat.budgetLimit) * 100
          );

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.itemRow,
                isSelected && styles.itemRowSelected,
                !isLast && styles.itemBorder,
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              {/* Category Icon */}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: cat.bgColor },
                ]}
              >
                <CategoryIcon
                  categoryKey={cat.key}
                  size={18}
                  color={cat.color}
                />
              </View>

              {/* Category Name & Progress */}
              <View style={styles.middleColumn}>
                <View style={styles.titleRow}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.percentText}>{cat.percentage}%</Text>
                </View>

                {/* Minimal Micro Progress Bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, percentSpentOfLimit)}%`,
                          backgroundColor:
                            percentSpentOfLimit > 90
                              ? Colors.warning
                              : Colors.forestGreen,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.budgetLimitText}>
                    ₹{cat.budgetLimit.toLocaleString('en-IN')} limit
                  </Text>
                </View>
              </View>

              {/* Bold Coinbase Amount in Neutral Slate */}
              <View style={styles.rightColumn}>
                <Text style={styles.amountText}>{formattedAmount}</Text>
                <ChevronRightIcon size={14} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: Colors.background,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  itemRowSelected: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: '#F1F5F9',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  budgetLimitText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
});

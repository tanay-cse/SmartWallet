import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { CategoryItem } from '../../types/budget';
import { CategoryIcon } from '../icons/BudgetIcons';

type CategoryDonutChartProps = {
  categories: CategoryItem[];
  totalAmount: number;
  mode: 'expense' | 'income';
  onChangeMode: (mode: 'expense' | 'income') => void;
  selectedCategory: CategoryItem | null;
  onSelectCategory: (category: CategoryItem | null) => void;
};

export function CategoryDonutChart({
  categories,
  totalAmount,
  mode,
  onChangeMode,
  selectedCategory,
  onSelectCategory,
}: CategoryDonutChartProps) {
  // Exact circular geometry parameters
  const svgSize = 250;
  const strokeWidth = 26;
  const radius = 90;
  const center = svgSize / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  const slices = categories.map((cat) => {
    const sliceRatio = cat.percentage / 100;
    const sliceLength = sliceRatio * circumference;
    const gap = categories.length > 1 ? 2.5 : 0;
    const activeLength = Math.max(1, sliceLength - gap);

    const currentOffset = cumulativeOffset;
    cumulativeOffset += sliceLength;

    // Angle to position orbiting badge icon at middle of slice
    const midRatio = (currentOffset + sliceLength / 2) / circumference;
    const midAngle = midRatio * 2 * Math.PI - Math.PI / 2;
    const badgeDistance = radius + strokeWidth / 2 + 18;
    const badgeX = center + badgeDistance * Math.cos(midAngle);
    const badgeY = center + badgeDistance * Math.sin(midAngle);

    const isSelected = selectedCategory?.id === cat.id;

    return {
      category: cat,
      color: cat.color,
      isSelected,
      dashArray: `${activeLength} ${circumference - activeLength}`,
      dashOffset: -currentOffset,
      badgeX,
      badgeY,
      percentage: cat.percentage,
    };
  });

  const formattedTotal = `₹${totalAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const displayAmount = selectedCategory
    ? `₹${selectedCategory.amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : formattedTotal;

  const displaySubtitle = selectedCategory
    ? `${selectedCategory.name} (${selectedCategory.percentage}%)`
    : mode === 'expense'
    ? 'Total Expenses'
    : 'Total Income';

  return (
    <View style={styles.container}>
      {/* Borderless Sub-toggle: Expenses | Income */}
      <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pillButton, mode === 'expense' && styles.pillButtonActive]}
          onPress={() => {
            onChangeMode('expense');
            onSelectCategory(null);
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.pillText, mode === 'expense' && styles.pillTextActive]}
          >
            Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pillButton, mode === 'income' && styles.pillButtonActive]}
          onPress={() => {
            onChangeMode('income');
            onSelectCategory(null);
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.pillText, mode === 'income' && styles.pillTextActive]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Flawless Perfectly Circular SVG Donut Canvas */}
      <View style={[styles.chartCanvasContainer, { width: svgSize + 40, height: svgSize + 40 }]}>
        <Svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={styles.svgCanvas}
        >
          {/* Subtle background track circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={Colors.surfaceSubtle}
            strokeWidth={strokeWidth}
          />

          {/* Slices rotated by -90deg so index 0 starts at 12 o'clock */}
          <G rotation="-90" origin={`${center}, ${center}`}>
            {slices.map((slice) => (
              <Circle
                key={slice.category.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={slice.isSelected ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
                strokeLinecap="butt"
                opacity={
                  selectedCategory
                    ? slice.isSelected
                      ? 1
                      : 0.25
                    : 0.95
                }
              />
            ))}
          </G>
        </Svg>

        {/* Center Typography (Coinbase Large Text) */}
        <TouchableOpacity
          style={styles.centerContent}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.9}
        >
          <Text style={styles.centerAmount}>{displayAmount}</Text>
          <Text style={styles.centerSubtitle}>{displaySubtitle}</Text>
        </TouchableOpacity>

        {/* Outer Minimal Badges */}
        {slices.map((slice) => {
          const isSelected = slice.isSelected;
          return (
            <TouchableOpacity
              key={`badge-${slice.category.id}`}
              style={[
                styles.orbitBadge,
                {
                  left: slice.badgeX + 20 - 15,
                  top: slice.badgeY + 20 - 15,
                  backgroundColor: slice.category.bgColor,
                  transform: [{ scale: isSelected ? 1.25 : 1 }],
                },
              ]}
              onPress={() =>
                onSelectCategory(isSelected ? null : slice.category)
              }
              activeOpacity={0.8}
            >
              <CategoryIcon
                categoryKey={slice.category.key}
                size={14}
                color={slice.category.color}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 3,
    marginBottom: 16,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  pillButtonActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  chartCanvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svgCanvas: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    zIndex: 2,
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  centerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  orbitBadge: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});

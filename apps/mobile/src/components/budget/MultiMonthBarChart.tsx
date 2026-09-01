import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { MonthlyComparison } from '../../types/budget';

type MultiMonthBarChartProps = {
  data: MonthlyComparison[];
  onSelectMonth?: (monthKey: string) => void;
};

export function MultiMonthBarChart({
  data,
  onSelectMonth,
}: MultiMonthBarChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('03/2026');

  const chartHeight = 140;

  const handleMonthPress = (monthKey: string) => {
    setSelectedMonth(monthKey);
    onSelectMonth?.(monthKey);
  };

  const activeItem = data.find((d) => d.monthKey === selectedMonth) || data[data.length - 1];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>3-Month History</Text>
          <Text style={styles.subtitle}>Income vs Expenses</Text>
        </View>
        {activeItem && (
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>
              {activeItem.monthKey}: Exp ₹{activeItem.expense.toLocaleString('en-IN')} | Inc ₹{activeItem.income.toLocaleString('en-IN')}
            </Text>
          </View>
        )}
      </View>

      {/* SVG Canvas (No heavy gridlines!) */}
      <View style={styles.svgContainer}>
        <Svg width="100%" height={chartHeight} viewBox="0 0 240 140">
          <Defs>
            {/* Expense: Neutral Slate Gray */}
            <LinearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.slateExpense} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={Colors.slateExpense} stopOpacity="0.95" />
            </LinearGradient>

            {/* Income: Forest Green */}
            <LinearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.forestGreen} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={Colors.forestGreenDark} stopOpacity="0.95" />
            </LinearGradient>
          </Defs>

          {/* Render Dual Bars */}
          {data.map((item, index) => {
            const groupCenterX = 40 + index * 80;
            const barWidth = 24;
            const gap = 4;
            const maxBarHeight = 120;
            const isSelected = item.monthKey === selectedMonth;

            const expenseHeight = Math.max(10, (item.expense / 2000) * maxBarHeight);
            const incomeHeight = Math.max(10, (item.income / 2000) * maxBarHeight);

            const expenseX = groupCenterX - barWidth - gap / 2;
            const incomeX = groupCenterX + gap / 2;

            const expenseY = 135 - expenseHeight;
            const incomeY = 135 - incomeHeight;

            return (
              <React.Fragment key={item.monthKey}>
                {/* Expense Bar */}
                <Rect
                  x={expenseX}
                  y={expenseY}
                  width={barWidth}
                  height={expenseHeight}
                  rx="4"
                  ry="4"
                  fill="url(#expenseGrad)"
                  opacity={isSelected ? 1 : 0.6}
                />

                {/* Income Bar */}
                <Rect
                  x={incomeX}
                  y={incomeY}
                  width={barWidth}
                  height={incomeHeight}
                  rx="4"
                  ry="4"
                  fill="url(#incomeGrad)"
                  opacity={isSelected ? 1 : 0.6}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Month Labels */}
        <View style={styles.xAxisRow}>
          {data.map((item) => {
            const isSelected = item.monthKey === selectedMonth;
            return (
              <TouchableOpacity
                key={item.monthKey}
                style={[styles.monthButton, isSelected && styles.monthButtonActive]}
                onPress={() => handleMonthPress(item.monthKey)}
                activeOpacity={0.7}
              >
                <Text style={[styles.monthLabel, isSelected && styles.monthLabelActive]}>
                  {item.monthKey}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Minimal Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.slateExpense }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.forestGreen }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activePill: {
    backgroundColor: Colors.forestGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  svgContainer: {
    height: 165,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  monthButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  monthButtonActive: {
    backgroundColor: Colors.surfaceSubtle,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  monthLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 10,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

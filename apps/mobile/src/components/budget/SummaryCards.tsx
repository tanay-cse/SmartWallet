import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';

type SummaryCardsProps = {
  expenseAmount: number;
  incomeAmount: number;
  netSavings: number;
  savingsRate: number;
  onPressExpense?: () => void;
  onPressIncome?: () => void;
};

export function SummaryCards({
  expenseAmount,
  incomeAmount,
  netSavings,
  savingsRate,
  onPressExpense,
  onPressIncome,
}: SummaryCardsProps) {
  const formattedSavings = `+₹${netSavings.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedIncome = `+₹${incomeAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedExpense = `-₹${expenseAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View style={styles.container}>
      {/* Small Muted Label */}
      <View style={styles.labelRow}>
        <Text style={styles.heroLabel}>NET CASHFLOW</Text>
        <View style={styles.deltaPill}>
          <Text style={styles.deltaText}>+{savingsRate}% saved</Text>
        </View>
      </View>

      {/* Massive Primary Hero Number (Coinbase oversized bold typography) */}
      <Text style={styles.heroAmount}>{formattedSavings}</Text>

      {/* Simple, Borderless Text Summaries Below Hero Number */}
      <View style={styles.breakdownRow}>
        {/* Income (Rich Forest Green) */}
        <TouchableOpacity
          style={styles.summaryCol}
          onPress={onPressIncome}
          activeOpacity={0.7}
        >
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryAmount, styles.incomeText]}>
            {formattedIncome}
          </Text>
        </TouchableOpacity>

        {/* Vertical divider */}
        <View style={styles.colDivider} />

        {/* Expenses (Neutral Slate Gray - NO RED!) */}
        <TouchableOpacity
          style={styles.summaryCol}
          onPress={onPressExpense}
          activeOpacity={0.7}
        >
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expenseText]}>
            {formattedExpense}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  deltaPill: {
    backgroundColor: Colors.forestGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  heroAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.forestGreen,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  summaryCol: {
    flex: 1,
  },
  colDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.4,
  },
  incomeText: {
    color: Colors.forestGreen,
  },
  expenseText: {
    color: Colors.slateExpense,
  },
});

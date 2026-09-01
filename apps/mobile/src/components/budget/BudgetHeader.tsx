import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { ChevronDownIcon } from '../icons/BudgetIcons';

type BudgetHeaderProps = {
  selectedPeriod: string;
  onPressPeriod: () => void;
};

export function BudgetHeader({
  selectedPeriod,
  onPressPeriod,
}: BudgetHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={styles.title}>Budget</Text>
      </View>

      <TouchableOpacity
        style={styles.periodPill}
        onPress={onPressPeriod}
        activeOpacity={0.7}
      >
        <Text style={styles.periodText}>{selectedPeriod}</Text>
        <ChevronDownIcon size={14} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

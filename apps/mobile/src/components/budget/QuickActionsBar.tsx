import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { PlusIcon } from '../icons/BudgetIcons';

type QuickActionsBarProps = {
  onAddBudget?: () => void;
};

export function QuickActionsBar({ onAddBudget }: QuickActionsBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBudgetButton}
        onPress={onAddBudget}
        activeOpacity={0.8}
      >
        <View style={styles.iconCircle}>
          <PlusIcon size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.actionLabel}>Add Budget</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.forestGreen,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import {
  ArrowUpRightIcon,
  CalendarIcon,
  DownloadIcon,
  PlusIcon,
} from '../icons/BudgetIcons';

type QuickActionsBarProps = {
  onAddBudget?: () => void;
  onTransfer?: () => void;
  onSchedule?: () => void;
  onExport?: () => void;
};

export function QuickActionsBar({
  onAddBudget,
  onTransfer,
  onSchedule,
  onExport,
}: QuickActionsBarProps) {
  const actions = [
    {
      id: 'add',
      label: 'Add Budget',
      icon: <PlusIcon size={16} color={Colors.textPrimary} />,
      onPress: onAddBudget,
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: <ArrowUpRightIcon size={16} color={Colors.textPrimary} />,
      onPress: onTransfer,
    },
    {
      id: 'schedule',
      label: 'Scheduled',
      icon: <CalendarIcon size={16} color={Colors.textPrimary} />,
      onPress: onSchedule,
    },
    {
      id: 'export',
      label: 'Statement',
      icon: <DownloadIcon size={16} color={Colors.textPrimary} />,
      onPress: onExport,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionBtn}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>{action.icon}</View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

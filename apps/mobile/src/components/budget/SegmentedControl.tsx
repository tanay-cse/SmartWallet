import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';

export type BudgetTab = 'overview' | 'breakdown';

type SegmentedControlProps = {
  activeTab: BudgetTab;
  onChangeTab: (tab: BudgetTab) => void;
};

export function SegmentedControl({ activeTab, onChangeTab }: SegmentedControlProps) {
  const isOverview = activeTab === 'overview';
  const isBreakdown = activeTab === 'breakdown';

  return (
    <View style={styles.wrapper}>
      <View style={styles.toggleTrack}>
        <TouchableOpacity
          style={[styles.toggleBtn, isOverview && styles.toggleBtnActive]}
          onPress={() => onChangeTab('overview')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, isOverview && styles.toggleTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, isBreakdown && styles.toggleBtnActive]}
          onPress={() => onChangeTab('breakdown')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, isBreakdown && styles.toggleTextActive]}>
            Breakdown
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 24,
    padding: 3,
    alignSelf: 'flex-start',
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleBtnActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

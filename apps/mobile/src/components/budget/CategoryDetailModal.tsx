import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { CategoryItem } from '../../types/budget';
import {
  CategoryIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/BudgetIcons';

type CategoryDetailModalProps = {
  visible: boolean;
  category: CategoryItem | null;
  onClose: () => void;
  onUpdateBudgetLimit?: (categoryId: string, newLimit: number) => void;
};

export function CategoryDetailModal({
  visible,
  category,
  onClose,
  onUpdateBudgetLimit,
}: CategoryDetailModalProps) {
  if (!category) return null;

  const [currentLimit, setCurrentLimit] = useState(category.budgetLimit);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const formattedSpent = `₹${category.amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedLimit = `₹${currentLimit.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const remaining = Math.max(0, currentLimit - category.amount);
  const percentUsed = Math.round((category.amount / currentLimit) * 100);

  const handleAdjust = (delta: number) => {
    const newLimit = Math.max(500, currentLimit + delta);
    setCurrentLimit(newLimit);
    onUpdateBudgetLimit?.(category.id, newLimit);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <View
                style={[
                  styles.headerIconCircle,
                  { backgroundColor: category.bgColor },
                ]}
              >
                <CategoryIcon
                  categoryKey={category.key}
                  size={20}
                  color={category.color}
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>{category.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {category.percentage}% of monthly budget
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <CloseIcon size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stat Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.heroLabel}>Total Spent</Text>
                  <Text style={styles.heroAmount}>{formattedSpent}</Text>
                </View>
                <View style={styles.heroRight}>
                  <Text style={styles.heroLabel}>Monthly Limit</Text>
                  <Text style={styles.heroLimitAmount}>{formattedLimit}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarActive,
                      {
                        width: `${Math.min(100, percentUsed)}%`,
                        backgroundColor:
                          percentUsed > 90
                            ? Colors.warning
                            : Colors.forestGreen,
                      },
                    ]}
                  />
                </View>

                <View style={styles.progressLabels}>
                  <Text style={styles.progressPercentText}>
                    {percentUsed}% utilized
                  </Text>
                  <Text style={styles.remainingText}>
                    ₹{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })} remaining
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Limit Adjustment */}
            <View style={styles.adjustmentCard}>
              <View style={styles.adjHeader}>
                <Text style={styles.adjTitle}>Adjust Monthly Limit</Text>
                {savedSuccess && (
                  <View style={styles.savedChip}>
                    <CheckIcon size={12} color={Colors.forestGreen} />
                    <Text style={styles.savedText}>Updated</Text>
                  </View>
                )}
              </View>

              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleAdjust(-1000)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>-₹1k</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleAdjust(-500)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>-₹500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stepperBtn, styles.stepperBtnActive]}
                  onPress={() => handleAdjust(500)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.stepperBtnText, styles.stepperBtnActiveText]}>
                    +₹500
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stepperBtn, styles.stepperBtnActive]}
                  onPress={() => handleAdjust(1000)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.stepperBtnText, styles.stepperBtnActiveText]}>
                    +₹1k
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Transactions List */}
            <View style={styles.transactionsCard}>
              <View style={styles.txHeader}>
                <Text style={styles.txTitle}>Recent Transactions</Text>
                <Text style={styles.txCount}>
                  {category.transactionCount} items
                </Text>
              </View>

              {category.recentTransactions && category.recentTransactions.length > 0 ? (
                category.recentTransactions.map((tx, idx) => (
                  <View
                    key={tx.id}
                    style={[
                      styles.txRow,
                      idx !== category.recentTransactions!.length - 1 &&
                        styles.txBorder,
                    ]}
                  >
                    <View style={styles.txInfo}>
                      <Text style={styles.txName}>{tx.title}</Text>
                      <Text style={styles.txMeta}>
                        {tx.date} • {tx.merchant}
                      </Text>
                    </View>
                    <Text style={styles.txAmount}>-₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noTxText}>No transactions recorded</Text>
              )}
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '80%',
  },
  grabber: {
    width: 36,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  heroRight: {
    alignItems: 'flex-end',
  },
  heroLimitAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  progressSection: {
    marginTop: 14,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarActive: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestGreen,
  },
  adjustmentCard: {
    marginTop: 14,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
  },
  adjHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adjTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.forestGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnActive: {
    backgroundColor: Colors.forestGreenLight,
  },
  stepperBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepperBtnActiveText: {
    color: Colors.forestGreen,
  },
  transactionsCard: {
    marginTop: 14,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  txCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  txBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  txMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slateExpense,
    fontVariant: ['tabular-nums'],
  },
  noTxText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
});

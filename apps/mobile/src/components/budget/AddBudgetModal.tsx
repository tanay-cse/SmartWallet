import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { CategoryItem } from '../../types/budget';
import { CategoryIcon, CheckIcon, CloseIcon } from '../icons/BudgetIcons';

type AddBudgetModalProps = {
  visible: boolean;
  categories: CategoryItem[];
  onClose: () => void;
  onAddBudget: (categoryId: string, amount: number) => void;
};

export function AddBudgetModal({
  visible,
  categories,
  onClose,
  onAddBudget,
}: AddBudgetModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [amountStr, setAmountStr] = useState<string>('5000');
  const [success, setSuccess] = useState<boolean>(false);

  const quickAmounts = [1000, 2500, 5000, 10000];

  const handleSave = () => {
    const num = parseFloat(amountStr) || 0;
    if (num > 0) {
      onAddBudget(selectedCatId, num);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    }
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

          <View style={styles.header}>
            <Text style={styles.title}>Set Budget Target</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Coinbase style big amount input */}
            <View style={styles.amountBox}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                autoFocus={false}
              />
            </View>
            <Text style={styles.amountSubtitle}>Monthly allocation limit</Text>

            {/* Quick chips in Rupees */}
            <View style={styles.chipsRow}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.chip}
                  onPress={() => setAmountStr(amt.toString())}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>₹{amt.toLocaleString('en-IN')}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Selector */}
            <Text style={styles.sectionLabel}>Select Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCatId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() => setSelectedCatId(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.catIconWrap,
                        { backgroundColor: cat.bgColor },
                      ]}
                    >
                      <CategoryIcon
                        categoryKey={cat.key}
                        size={16}
                        color={cat.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.catName,
                        isSelected && styles.catNameSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Submit Button in Forest Green */}
            <TouchableOpacity
              style={[styles.saveBtn, success && styles.saveBtnSuccess]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              {success ? (
                <View style={styles.btnContent}>
                  <CheckIcon size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Budget Allocated</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>Save Budget Cap</Text>
              )}
            </TouchableOpacity>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingVertical: 18,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.forestGreen,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    minWidth: 100,
    textAlign: 'left',
  },
  amountSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSubtle,
    minWidth: '47%',
    flex: 1,
  },
  categoryCardSelected: {
    backgroundColor: Colors.forestGreenLight,
  },
  catIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  catNameSelected: {
    color: Colors.forestGreen,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: Colors.forestGreen,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnSuccess: {
    backgroundColor: Colors.forestGreenDark,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

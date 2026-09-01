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
import { CardNetwork, VaultCard } from '../../types/vault';
import { CheckIcon, CloseIcon } from '../icons/BudgetIcons';
import { CardNetworkLogo } from './CardNetworkLogo';

type AddCardModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddCard: (newCard: VaultCard) => void;
};

export function AddCardModal({
  visible,
  onClose,
  onAddCard,
}: AddCardModalProps) {
  const [bank, setBank] = useState('HDFC BANK');
  const [name, setName] = useState('Millennia Cashback');
  const [network, setNetwork] = useState<CardNetwork>('visa');
  const [last4, setLast4] = useState('5421');
  const [expiry, setExpiry] = useState('11/29');
  const [cardholder, setCardholder] = useState('CHIRAG PATEL');
  const [bestCategory, setBestCategory] = useState('Online Shopping');
  const [rewardRate, setRewardRate] = useState('5% Cashback');
  const [success, setSuccess] = useState(false);

  const networks: CardNetwork[] = ['visa', 'mastercard', 'rupay', 'amex'];
  const categoryOptions = [
    { cat: 'Dining & Food', rate: '5% Cashback' },
    { cat: 'Online Shopping', rate: '5% Cashback' },
    { cat: 'Travel & Flights', rate: '10X Points' },
    { cat: 'UPI & Groceries', rate: '5% NeuCoins' },
    { cat: 'Fuel & Transit', rate: '4X Points' },
  ];

  const handleSave = () => {
    if (!bank.trim() || !last4.trim()) return;

    const newCard: VaultCard = {
      id: `card-${Date.now()}`,
      bank: bank.toUpperCase().trim(),
      name: name.trim() || 'Smart Credit Card',
      network,
      last4: last4.slice(-4),
      bestCategory,
      rewardRate,
      cardType: 'credit',
      cardholderName: cardholder.toUpperCase(),
      expiryDate: expiry || '12/29',
      balanceOrLimit: 300000.00,
      availableLimit: 300000.00,
      currency: '₹',
      gradientColors:
        network === 'visa'
          ? ['#0F2744', '#1E3A8A', '#0F172A']
          : network === 'mastercard'
          ? ['#1E293B', '#334155', '#0F172A']
          : network === 'rupay'
          ? ['#064E3B', '#065F46', '#022C22']
          : ['#334155', '#475569', '#1E293B'],
      patternType: 'circles',
      baseRewardRate: '1% Unlimited Cashback on all other spends',
      perks: [
        {
          id: `p-${Date.now()}-1`,
          title: `${rewardRate} on ${bestCategory}`,
          description: `Auto-recommended for highest cashback when spending on ${bestCategory}`,
          tag: 'Best In Category',
        },
        {
          id: `p-${Date.now()}-2`,
          title: 'Encrypted Vault Token',
          description: 'AES-256 encrypted & tokenized under RBI device tokenization standards',
        },
      ],
    };

    onAddCard(newCard);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
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
            <Text style={styles.title}>Add Card to Vault</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Bank Name */}
            <Text style={styles.inputLabel}>Issuing Bank</Text>
            <TextInput
              style={styles.textInput}
              value={bank}
              onChangeText={setBank}
              placeholder="e.g. HDFC Bank, ICICI, SBI"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Card Name */}
            <Text style={styles.inputLabel}>Card Name / Variant</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Regalia Gold, Millennia"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Network Selector */}
            <Text style={styles.inputLabel}>Card Network</Text>
            <View style={styles.networkRow}>
              {networks.map((net) => {
                const isSelected = network === net;
                return (
                  <TouchableOpacity
                    key={net}
                    style={[
                      styles.networkTab,
                      isSelected && styles.networkTabSelected,
                    ]}
                    onPress={() => setNetwork(net)}
                    activeOpacity={0.7}
                  >
                    <CardNetworkLogo network={net} size={30} />
                    <Text
                      style={[
                        styles.networkLabel,
                        isSelected && styles.networkLabelSelected,
                      ]}
                    >
                      {net.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Card Details Row: Last 4 and Expiry */}
            <View style={styles.dualInputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Last 4 Digits</Text>
                <TextInput
                  style={styles.textInput}
                  value={last4}
                  onChangeText={setLast4}
                  maxLength={4}
                  keyboardType="numeric"
                  placeholder="4812"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                <TextInput
                  style={styles.textInput}
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                  placeholder="10/28"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Best Spend Category & Attached Reward Rate (SRS FR-2) */}
            <Text style={styles.inputLabel}>Best Spend Category Rule</Text>
            <View style={styles.categoriesGrid}>
              {categoryOptions.map((opt) => {
                const isSelected = bestCategory === opt.cat;
                return (
                  <TouchableOpacity
                    key={opt.cat}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillSelected,
                    ]}
                    onPress={() => {
                      setBestCategory(opt.cat);
                      setRewardRate(opt.rate);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryPillTitle,
                        isSelected && styles.categoryPillTitleSelected,
                      ]}
                    >
                      {opt.cat}
                    </Text>
                    <Text
                      style={[
                        styles.categoryPillRate,
                        isSelected && styles.categoryPillRateSelected,
                      ]}
                    >
                      {opt.rate}
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
                  <Text style={styles.saveBtnText}>Card Encrypted & Saved</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>Encrypt & Save Card</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
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
    maxHeight: '85%',
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  networkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  networkTab: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.6,
  },
  networkTabSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.forestGreen,
  },
  networkLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  networkLabelSelected: {
    color: '#FFFFFF',
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryPill: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: '47%',
    flex: 1,
  },
  categoryPillSelected: {
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
  },
  categoryPillTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryPillTitleSelected: {
    color: Colors.forestGreenDark,
    fontWeight: '700',
  },
  categoryPillRate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  categoryPillRateSelected: {
    color: Colors.forestGreen,
  },
  saveBtn: {
    backgroundColor: Colors.forestGreen,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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

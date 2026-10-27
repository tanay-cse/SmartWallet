import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UpiPinModalProps {
  visible: boolean;
  amount: number | string;
  payeeUpiId?: string;
  cardName?: string;
  cardLast4?: string;
  pinLength?: 4 | 6;
  onClose: () => void;
  onPinSubmit: (pin: string) => void;
}

export function UpiPinModal({
  visible,
  amount,
  payeeUpiId = 'merchant@upi',
  cardName = 'HDFC Regalia Gold',
  cardLast4 = '8821',
  pinLength = 4,
  onClose,
  onPinSubmit,
}: UpiPinModalProps) {
  const [pin, setPin] = useState<string>('');

  // Handle number click
  const handleKeyPress = (digit: string) => {
    if (pin.length < pinLength) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === pinLength) {
        // Auto submit once PIN is completely filled
        setTimeout(() => {
          onPinSubmit(nextPin);
          setPin('');
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleModalClose = () => {
    setPin('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* NPCI Header / Shield Banner */}
          <View style={styles.topHeader}>
            <View style={styles.bankHeaderRow}>
              <View style={styles.bankBadge}>
                <Text style={styles.bankBadgeText}>UPI</Text>
              </View>
              <Text style={styles.headerTitle}>ENTER UPI PIN</Text>
              <TouchableOpacity
                onPress={handleModalClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
            </View>

            {/* Card, Merchant & Amount Context */}
            <View style={styles.contextCard}>
              <View style={styles.payeeRow}>
                <Text style={styles.payeeLabel}>Paying to</Text>
                <Text style={styles.payeeValue} numberOfLines={1}>
                  {payeeUpiId}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.payeeRow}>
                <Text style={styles.payeeLabel}>Paying with</Text>
                <Text style={styles.payeeValue} numberOfLines={1}>
                  {cardName} (•• {cardLast4})
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amountValue}>₹{amount}</Text>
              </View>
            </View>
          </View>

          {/* PIN Input Dots Section */}
          <View style={styles.pinSection}>
            <Text style={styles.pinPrompt}>Enter {pinLength}-digit UPI PIN</Text>
            <View style={styles.dotsRow}>
              {Array.from({ length: pinLength }).map((_, idx) => {
                const isFilled = idx < pin.length;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.dotCircle,
                      isFilled && styles.dotCircleFilled,
                    ]}
                  >
                    {isFilled && <View style={styles.innerDot} />}
                  </View>
                );
              })}
            </View>
            <Text style={styles.securityWarning}>
              🔒 UPI PIN will keep your account safe. Never share it with anyone.
            </Text>
          </View>

          {/* Numeric Keypad Grid */}
          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              {['1', '2', '3'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.keyButton}
                  onPress={() => handleKeyPress(digit)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keyDigit}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.keypadRow}>
              {['4', '5', '6'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.keyButton}
                  onPress={() => handleKeyPress(digit)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keyDigit}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.keypadRow}>
              {['7', '8', '9'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.keyButton}
                  onPress={() => handleKeyPress(digit)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keyDigit}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.keypadRow}>
              <View style={styles.keyButtonBlank} />
              <TouchableOpacity
                style={styles.keyButton}
                onPress={() => handleKeyPress('0')}
                activeOpacity={0.6}
              >
                <Text style={styles.keyDigit}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keyButton}
                onPress={handleBackspace}
                activeOpacity={0.6}
              >
                <Text style={styles.backspaceIcon}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  topHeader: {
    marginBottom: 16,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  bankBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bankBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  contextCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  payeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payeeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  payeeValue: {
    fontSize: 13.5,
    color: Colors.textPrimary,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.55,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  pinSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  pinPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 16,
  },
  dotCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dotCircleFilled: {
    borderColor: Colors.forestGreen,
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.forestGreen,
  },
  securityWarning: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  keypadContainer: {
    width: '100%',
    paddingTop: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  keyButton: {
    width: (SCREEN_WIDTH - 80) / 3,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  keyButtonBlank: {
    width: (SCREEN_WIDTH - 80) / 3,
    height: 52,
  },
  keyDigit: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  backspaceIcon: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

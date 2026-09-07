import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

const LIVE_SILVER_PRICE_PER_GRAM = 245.17; // In INR

export function BuySilverScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [buyMode, setBuyMode] = useState<'rupees' | 'grams'>('rupees');
  const [inputValue, setInputValue] = useState('500');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const calculatedEquivalent = useMemo(() => {
    const num = parseFloat(inputValue) || 0;
    if (buyMode === 'rupees') {
      const grams = (num / LIVE_SILVER_PRICE_PER_GRAM).toFixed(4);
      return `= ${grams}g`;
    } else {
      const inr = Math.round(num * LIVE_SILVER_PRICE_PER_GRAM);
      return `= ₹${inr.toLocaleString('en-IN')}`;
    }
  }, [inputValue, buyMode]);

  const handleProceed = () => {
    Alert.alert(
      'Confirm 999 Pure Silver Purchase',
      `Buying ${calculatedEquivalent.replace('= ', '')} 99.9% pure Digital Silver for ₹${buyMode === 'rupees' ? inputValue : (parseFloat(inputValue) * LIVE_SILVER_PRICE_PER_GRAM).toFixed(2)} (Live rate: ₹${LIVE_SILVER_PRICE_PER_GRAM}/g + 3% GST).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay via UPI',
          style: 'default',
          onPress: () => {
            Alert.alert('Silver Credited', '999 Pure Digital Silver deposited safely into your insured locker.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* ==================== HEADER ==================== */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Buy Digital Silver</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Buy Silver Help', 'Buy 999 purity certified digital silver at live rates with zero making charges & free vault storage.');
          }}
          activeOpacity={0.7}
        >
          <QuestionHelpIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <View style={styles.clockIconCircle}>
              <Text style={{ fontSize: 18 }}>⏱️</Text>
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoTitle}>Safe, secure & pure silver</Text>
              <Text style={styles.infoSubtitle}>Real silver, real savings</Text>
            </View>
          </View>

          {/* Mode Switch Radios */}
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => {
                setBuyMode('rupees');
                setInputValue('500');
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.radioCircle, buyMode === 'rupees' && styles.radioCircleActive]}>
                {buyMode === 'rupees' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.radioLabel, buyMode === 'rupees' && styles.radioLabelActive]}>
                Buy in rupees
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => {
                setBuyMode('grams');
                setInputValue('2');
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.radioCircle, buyMode === 'grams' && styles.radioCircleActive]}>
                {buyMode === 'grams' && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.radioLabel, buyMode === 'grams' && styles.radioLabelActive]}>
                Buy in grams
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Box with Equivalent display */}
          <View style={styles.inputBox}>
            <Text style={styles.inputPrefix}>{buyMode === 'rupees' ? '₹' : 'g'}</Text>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              maxLength={8}
            />
            <Text style={styles.equivalentValue}>{calculatedEquivalent}</Text>
          </View>

          {/* Live Price Tag */}
          <View style={styles.liveTagRow}>
            <View style={styles.liveIndicatorDot} />
            <Text style={styles.livePriceText}>
              LIVE Buy Price: ₹{LIVE_SILVER_PRICE_PER_GRAM}/g + 3% GST
            </Text>
          </View>

          {/* Recommended Pills */}
          <Text style={styles.recommendedHeading}>Recommended</Text>
          <View style={styles.pillsRow}>
            {buyMode === 'rupees'
              ? ['1000', '2000', '5000', '10000'].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.recomPill}
                    onPress={() => setInputValue(amt)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.recomPillText}>₹{amt}</Text>
                  </TouchableOpacity>
                ))
              : ['5', '10', '25', '50'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={styles.recomPill}
                    onPress={() => setInputValue(g)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.recomPillText}>{g}g</Text>
                  </TouchableOpacity>
                ))}
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          By continuing, you agree to the Terms and Conditions and creation of a gold/silver account.
        </Text>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceed}
          activeOpacity={0.88}
        >
          <Text style={styles.proceedBtnText}>PROCEED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background, // Crisp white
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  helpButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  infoCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  clockIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.forestGreen,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.forestGreen,
  },
  radioLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  radioLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.forestGreenBorder,
    marginBottom: 12,
  },
  inputPrefix: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    padding: 0,
  },
  equivalentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  livePriceText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  recommendedHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  recomPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
  },
  recomPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  proceedBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  proceedBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

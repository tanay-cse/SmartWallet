import React, { useState } from 'react';
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
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Daily Gold Savings Jar SVG Illustration
function DailyGoldJarGraphic() {
  return (
    <Svg width="100%" height={160} viewBox="0 0 340 160" fill="none">
      <Defs>
        <LinearGradient id="goldJarBg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFBEB" />
          <Stop offset="100%" stopColor="#FEF3C7" />
        </LinearGradient>
        <LinearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>

      {/* Background container */}
      <Rect width="340" height="160" rx="20" fill="url(#goldJarBg)" />

      {/* Sparkles */}
      <Circle cx="60" cy="50" r="2" fill="#F59E0B" />
      <Circle cx="280" cy="40" r="2.5" fill="#F59E0B" />
      <Path d="M290 80L292 84L296 85.5L292 87L290 91L288 87L284 85.5L288 84Z" fill="#F59E0B" />

      {/* Gold Jar Glass */}
      <Rect x="125" y="65" width="90" height="75" rx="16" fill="#FFFFFF" fillOpacity="0.8" stroke="#FDE68A" strokeWidth="2" />
      <Rect x="135" y="55" width="70" height="12" rx="4" fill="#F59E0B" />

      {/* Stacked Gold Coins Inside Jar */}
      <Ellipse cx="170" cy="115" rx="30" ry="10" fill="url(#coinGrad)" />
      <Ellipse cx="170" cy="104" rx="28" ry="9" fill="url(#coinGrad)" stroke="#FEF08A" strokeWidth="1" />
      <Ellipse cx="170" cy="94" rx="26" ry="8" fill="url(#coinGrad)" stroke="#FEF08A" strokeWidth="1" />

      {/* Gold Bar at Base */}
      <Rect x="90" y="125" width="40" height="18" rx="3" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
      <SvgText x="110" y="138" fontSize="7" fontWeight="bold" fill="#FEF08A" textAnchor="middle">24K</SvgText>

      {/* Hand depositing Rupee note into Jar */}
      <Path d="M185 10C185 20 180 35 174 48L160 44C165 32 170 20 170 10Z" fill="#FCA5A5" />
      <Rect x="150" y="30" width="34" height="20" rx="2" transform="rotate(-25 150 30)" fill="#DB2777" stroke="#FBCFE8" strokeWidth="1" />
      <SvgText x="174" y="42" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function DailyGoldScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [dailyAmount, setDailyAmount] = useState('30');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleContinueSetup = () => {
    Alert.alert(
      'Setup Daily Gold SIP',
      `Auto-invest ₹${dailyAmount} daily in 99.99% 24K pure digital gold via UPI Autopay. You can pause or withdraw anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set UPI Autopay',
          style: 'default',
          onPress: () => {
            Alert.alert('Autopay Mandate Active', `Daily Gold SIP of ₹${dailyAmount}/day scheduled successfully.`);
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

        <Text style={styles.headerTitle}>Daily Gold Savings</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Daily Gold Help', 'Build gold wealth systematically with automated daily micro-savings in 24K 99.99% pure gold.');
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
        {/* Hero Jar Graphic */}
        <View style={styles.graphicContainer}>
          <DailyGoldJarGraphic />
        </View>

        {/* Headline & Sub-features */}
        <View style={styles.headlineBox}>
          <Text style={styles.mainHeadline}>Save your money in Gold</Text>
          <View style={styles.featuresRow}>
            <Text style={styles.featurePillText}>Start with just ₹10</Text>
            <View style={styles.featureDivider} />
            <Text style={styles.featurePillText}>Save daily automatically</Text>
            <View style={styles.featureDivider} />
            <Text style={styles.featurePillText}>Pause or Stop anytime</Text>
          </View>
        </View>

        {/* Amount Input Box */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Amount to save daily</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={dailyAmount}
              onChangeText={setDailyAmount}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>

          {/* Quick Amount Pills */}
          <View style={styles.pillsRow}>
            {['10', '30', '40', '100'].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickPill,
                  dailyAmount === amt && styles.quickPillActive,
                ]}
                onPress={() => setDailyAmount(amt)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.quickPillText,
                    dailyAmount === amt && styles.quickPillTextActive,
                  ]}
                >
                  ₹{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Social Proof Banner */}
        <View style={styles.socialProofCard}>
          <Text style={styles.socialProofText}>
            <Text style={styles.socialProofBold}>2.7 Crore+ </Text>
            Indians save in Gold, Silver & Platinum on SmartWallet
          </Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          By continuing you agree to the T&Cs, Privacy Policy & creation of a gold account.
        </Text>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomFooter}>
        <View style={styles.bottomLeftCol}>
          <Text style={styles.bottomAmountText}>₹{dailyAmount || '0'}</Text>
          <TouchableOpacity onPress={() => Alert.alert('Price Breakup', `Daily SIP: ₹${dailyAmount}\nPure 24K Gold Rate: ₹15,939/g\nGST (3%): Included\nVault Storage: Free in insured Brinks vaults.`)}>
            <Text style={styles.viewBreakupLink}>View Breakup</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueSetup}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>Continue Setup</Text>
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
    paddingTop: 12,
    paddingBottom: 110,
  },
  graphicContainer: {
    marginBottom: 16,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  headlineBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  featurePillText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  featureDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderSubtle,
  },
  inputCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 10,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 14,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    padding: 0,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
  },
  quickPillActive: {
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreenBorder,
  },
  quickPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quickPillTextActive: {
    color: Colors.forestGreenDark,
  },
  socialProofCard: {
    backgroundColor: '#1E3A2F', // Forest green soft banner
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  socialProofText: {
    fontSize: 12,
    color: '#E6F4EA',
    textAlign: 'center',
    lineHeight: 18,
  },
  socialProofBold: {
    fontWeight: '800',
    color: '#86EFAC',
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 16,
  },
  bottomLeftCol: {
    justifyContent: 'center',
  },
  bottomAmountText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  viewBreakupLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.forestGreen,
    marginTop: 2,
  },
  continueBtn: {
    flex: 1,
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
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

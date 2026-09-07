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
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Hero Gold Loan Exchange SVG Vector Illustration
function GoldLoanHeroGraphic() {
  return (
    <Svg width="100%" height={160} viewBox="0 0 340 160" fill="none">
      <Defs>
        <LinearGradient id="bgGlow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#0F172A" />
          <Stop offset="100%" stopColor="#1E293B" />
        </LinearGradient>
        <LinearGradient id="goldBangleGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="50%" stopColor="#EAB308" />
          <Stop offset="100%" stopColor="#CA8A04" />
        </LinearGradient>
        <LinearGradient id="cashGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#F472B6" />
          <Stop offset="100%" stopColor="#DB2777" />
        </LinearGradient>
      </Defs>

      {/* Dark Radiance Backdrop */}
      <Rect width="340" height="160" rx="20" fill="url(#bgGlow)" />

      {/* Star sparkles */}
      <Path d="M170 30L172 36L178 38L172 40L170 46L168 40L162 38L168 36Z" fill="#FDE047" />
      <Circle cx="80" cy="40" r="1.5" fill="#FEF08A" />
      <Circle cx="260" cy="40" r="1.5" fill="#FEF08A" />

      {/* Left Hand holding Gold Jewelry */}
      <Path d="M-10 110C30 110 70 115 95 110C105 108 115 102 120 95C105 90 90 85 60 88L-10 92Z" fill="#D97706" fillOpacity="0.8" />
      {/* Gold Bangles */}
      <Ellipse cx="90" cy="85" rx="20" ry="10" fill="url(#goldBangleGrad)" stroke="#FEF08A" strokeWidth="1.5" />
      <Ellipse cx="102" cy="82" rx="20" ry="10" fill="url(#goldBangleGrad)" stroke="#FEF08A" strokeWidth="1.5" />
      <Circle cx="118" cy="88" r="4.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />

      {/* Right Hand holding Cash Currency */}
      <Path d="M350 110C310 110 270 115 245 110C235 108 225 102 220 95C235 90 250 85 280 88L350 92Z" fill="#C2410C" fillOpacity="0.8" />
      {/* Cash Notes */}
      <Rect x="200" y="65" width="46" height="30" rx="3" transform="rotate(-15 200 65)" fill="url(#cashGrad)" stroke="#FBCFE8" strokeWidth="1" />
      <Rect x="195" y="70" width="46" height="30" rx="3" transform="rotate(-5 195 70)" fill="url(#cashGrad)" stroke="#FBCFE8" strokeWidth="1" />
      <Circle cx="222" cy="82" r="6" fill="#FFFFFF" fillOpacity="0.3" />
      <SvgText x="222" y="85" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function GoldLoanScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [pincode, setPincode] = useState('147004');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  // Approximate gold weight calculation (₹1,00,000 ~ 9.58 g)
  const estimatedGoldGrams = ((loanAmount / 100000) * 9.58).toFixed(2);

  const handleFindBranches = () => {
    Alert.alert(
      'Nearby Gold Loan Branches',
      `Locating authorized partner branches near pincode ${pincode} (Patiala, Punjab)...\nEstimated Gold requirement: ~${estimatedGoldGrams} g for ₹${loanAmount.toLocaleString('en-IN')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Branch Slot',
          style: 'default',
          onPress: () => {
            Alert.alert('Slot Reserved', 'Branch executive will contact you for instant priority gold valuation.');
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

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Gold Loan Help', 'Get maximum value for your 18K/22K/24K gold jewelry with 100% locker security & lowest interest rates.');
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
        {/* Hero Graphic Banner */}
        <View style={styles.heroBannerContainer}>
          <GoldLoanHeroGraphic />
        </View>

        {/* Loan Amount Calculator Box */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorLabel}>Loan amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>₹ {loanAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.goldEstimateText}>= {estimatedGoldGrams} g</Text>
          </View>

          {/* Quick Amount Selectors */}
          <View style={styles.amountPillsRow}>
            {[50000, 100000, 250000, 500000].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.amountPill, loanAmount === amt && styles.amountPillActive]}
                onPress={() => setLoanAmount(amt)}
              >
                <Text style={[styles.amountPillText, loanAmount === amt && styles.amountPillTextActive]}>
                  ₹{(amt / 1000)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pincode Box */}
        <View style={styles.pincodeCard}>
          <Text style={styles.pincodeLabel}>Pincode</Text>
          <View style={styles.pincodeInputRow}>
            <TextInput
              style={styles.pincodeInput}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity onPress={() => Alert.alert('Location', 'GPS location: Patiala, Punjab detected.')}>
              <Text style={{ fontSize: 18 }}>🎯</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cityName}>Patiala, Punjab</Text>
        </View>

        {/* ==================== HOW DOES IT WORK ==================== */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.howItWorksTitle}>How does it work?</Text>

          {/* Step 1 */}
          <View style={styles.workStepCard}>
            <View style={[styles.stepIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 24 }}>💰</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepHeading}>Tell us your requirements</Text>
              <Text style={styles.stepSubtext}>Loan amount and Gold weight you want to pledge</Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.workStepCard}>
            <View style={[styles.stepIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{ fontSize: 24 }}>🏦</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepHeading}>Visit the nearest branch</Text>
              <Text style={styles.stepSubtext}>We'll connect you to the nearest branch. Bring your gold with you</Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.workStepCard}>
            <View style={[styles.stepIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 24 }}>⚡</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepHeading}>Get loan disbursed</Text>
              <Text style={styles.stepSubtext}>Get your loan quickly in your bank account with minimal documentation</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          By continuing you agree to SmartWallet Lending's T&Cs and Privacy policy, and give your consent for SmartWallet Lending to collect, use, store, and share your details for loan fulfillment.
        </Text>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={styles.findBranchesBtn}
          onPress={handleFindBranches}
          activeOpacity={0.88}
        >
          <Text style={styles.findBranchesText}>Find Nearby Branches</Text>
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
    paddingTop: 8,
    paddingBottom: 110,
  },
  heroBannerContainer: {
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  calculatorCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  calculatorLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  goldEstimateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
  },
  amountPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountPill: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
  },
  amountPillActive: {
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreenBorder,
  },
  amountPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  amountPillTextActive: {
    color: Colors.forestGreenDark,
  },
  pincodeCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 24,
  },
  pincodeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  pincodeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pincodeInput: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    padding: 0,
    flex: 1,
  },
  cityName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  howItWorksSection: {
    marginBottom: 20,
  },
  howItWorksTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  workStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 10,
    gap: 14,
  },
  stepIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInfo: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  stepSubtext: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
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
  findBranchesBtn: {
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
  findBranchesText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

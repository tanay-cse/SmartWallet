import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Vector Comparison Chart with Mascot Bird
function MutualFundLoanComparisonChart() {
  return (
    <Svg width="100%" height={210} viewBox="0 0 320 210" fill="none">
      <Defs>
        <LinearGradient id="bar1Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FDA4AF" />
          <Stop offset="100%" stopColor="#FFE4E6" />
        </LinearGradient>
        <LinearGradient id="bar2Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FBCFE8" />
          <Stop offset="100%" stopColor="#FDF2F8" />
        </LinearGradient>
        <LinearGradient id="bar3Grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#A78BFA" />
          <Stop offset="100%" stopColor="#C4B5FD" />
        </LinearGradient>
      </Defs>

      {/* Baseline Divider */}
      <Rect x="20" y="146" width="280" height="3" rx="1.5" fill="#E2E8F0" />

      {/* Bar 1: Credit Card (Tallest) */}
      <Rect x="42" y="30" width="56" height="116" rx="12" fill="url(#bar1Grad)" />

      {/* Bar 2: Personal Loan (Medium) */}
      <Rect x="132" y="70" width="56" height="76" rx="12" fill="url(#bar2Grad)" />

      {/* Bar 3: Loan Against MF (Lowest) */}
      <Rect x="222" y="96" width="56" height="50" rx="12" fill="url(#bar3Grad)" />

      {/* Cute Mascot Bird perched on top of Bar 3 */}
      {/* Bird Body */}
      <Circle cx="250" cy="74" r="17" fill="#60A5FA" />
      <Circle cx="244" cy="71" r="14" fill="#93C5FD" />
      {/* Bird Wing */}
      <Path d="M256 70C260 76 258 84 250 86C254 84 256 78 256 70Z" fill="#2563EB" />
      {/* Beak & Cheeks */}
      <Path d="M232 72L227 75L232 78Z" fill="#F59E0B" />
      <Circle cx="238" cy="74" r="2.5" fill="#F43F5E" />
      {/* Eye */}
      <Circle cx="236" cy="69" r="1.5" fill="#0F172A" />
      {/* Little legs */}
      <Path d="M246 91V96M254 91V96" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Labels below baseline */}
      <SvgText x="70" y="165" fontSize="11" fontWeight="700" fill="#0F172A" textAnchor="middle">Credit</SvgText>
      <SvgText x="70" y="179" fontSize="11" fontWeight="700" fill="#0F172A" textAnchor="middle">Card</SvgText>

      <SvgText x="160" y="165" fontSize="11" fontWeight="700" fill="#0F172A" textAnchor="middle">Personal</SvgText>
      <SvgText x="160" y="179" fontSize="11" fontWeight="700" fill="#0F172A" textAnchor="middle">Loan</SvgText>

      <SvgText x="250" y="165" fontSize="10.5" fontWeight="700" fill="#065F46" textAnchor="middle">Loan Against</SvgText>
      <SvgText x="250" y="179" fontSize="10.5" fontWeight="700" fill="#065F46" textAnchor="middle">Mutual Funds</SvgText>
    </Svg>
  );
}

const STEPS = [
  {
    num: '1',
    title: 'Fetch mutual funds & get loan offers',
    desc: 'Enter PAN and OTP to fetch mutual funds and get the best loan offers.',
  },
  {
    num: '2',
    title: 'Select loan amount',
    desc: 'Select the amount you wish to borrow.',
  },
  {
    num: '3',
    title: 'Complete KYC & set Autopay',
    desc: 'Share your details and set up easy payments',
  },
  {
    num: '4',
    title: 'Pledge funds',
    desc: 'Secure your loan using mutual funds',
  },
  {
    num: '5',
    title: 'Get instant cash',
    desc: 'Sign the agreement and get cash instantly in your bank!',
  },
];

export function MutualFundsLoanScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleGetLoanOffers = () => {
    Alert.prompt
      ? Alert.prompt(
          'Fetch Mutual Funds',
          'Enter your PAN number to view eligible loan limits:',
          (text) => {
            if (text) {
              Alert.alert('Mutual Funds Fetched', `Portfolio for PAN ${text.toUpperCase()} verified. Maximum eligible loan: ₹4,50,000 @ 10% p.a.`);
            }
          }
        )
      : Alert.alert('Fetch Mutual Funds', 'Enter PAN & OTP to fetch your mutual fund portfolio.');
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
            Alert.alert('LAMF Help', 'Borrow cash against your mutual fund units without liquidating your investments or stopping SIPs.');
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
        {/* Hero Title */}
        <View style={styles.heroTitleContainer}>
          <Text style={styles.heroSubtitle}>Loan against Mutual Funds</Text>
          <Text style={styles.heroHeading}>Interest starting @ 10% p.a.</Text>
        </View>

        {/* Comparison Chart */}
        <View style={styles.chartCard}>
          <MutualFundLoanComparisonChart />
        </View>

        {/* Consent Text */}
        <Text style={styles.consentText}>
          Allow SmartWallet Lending to fetch your credit information from RBI-approved bureau(s) and offer credit-related products / services. T&C apply.
        </Text>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleGetLoanOffers}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryBtnText}>Get Loan Offers</Text>
        </TouchableOpacity>

        {/* ==================== HOW IT WORKS ==================== */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.howItWorksHeading}>KNOW HOW IT WORKS</Text>

          <View style={styles.stepsContainer}>
            {STEPS.map((step, idx) => (
              <View key={step.num} style={styles.stepRow}>
                <View style={styles.stepNumCol}>
                  <View style={styles.stepNumCircle}>
                    <Text style={styles.stepNumText}>{step.num}</Text>
                  </View>
                  {idx < STEPS.length - 1 && <View style={styles.stepDottedLine} />}
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ==================== WHAT HAPPENS TO YOUR FUNDS ==================== */}
        <View style={styles.fundsCard}>
          <Text style={styles.fundsCardTitle}>What happens to your funds</Text>

          <View style={styles.fundsGrid}>
            <View style={styles.fundBenefitItem}>
              <Text style={styles.fundBenefitStar}>★</Text>
              <Text style={styles.fundBenefitText}>SIPs remain active</Text>
            </View>
            <View style={styles.fundBenefitItem}>
              <Text style={styles.fundBenefitStar}>★</Text>
              <Text style={styles.fundBenefitText}>Earn market returns</Text>
            </View>
            <View style={styles.fundBenefitItem}>
              <Text style={styles.fundBenefitStar}>★</Text>
              <Text style={styles.fundBenefitText}>No selling of funds</Text>
            </View>
            <View style={styles.fundBenefitItem}>
              <Text style={styles.fundBenefitStar}>★</Text>
              <Text style={styles.fundBenefitText}>Free Unpledge</Text>
            </View>
          </View>
        </View>

        {/* Footer Legal Links */}
        <View style={styles.footerLinksBox}>
          <Text style={styles.footerCompanyName}>SmartWallet Lending Services Private Limited.</Text>
          <Text style={styles.footerLegalLinks}>Terms & Conditions • Privacy Policy • Grievances Policy</Text>
          <Text style={styles.footerDisclaimer}>By proceeding you allow us to call you for loan assistance</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  heroTitleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  heroHeading: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  chartCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
    alignItems: 'center',
  },
  consentText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  howItWorksSection: {
    marginBottom: 24,
  },
  howItWorksHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepNumCol: {
    alignItems: 'center',
  },
  stepNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stepDottedLine: {
    width: 2,
    height: 36,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 3,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  fundsCard: {
    backgroundColor: '#3B2014', // Warm deep brown-rose accent block
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  fundsCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  fundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fundBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '46%',
    gap: 6,
  },
  fundBenefitStar: {
    color: '#F59E0B',
    fontSize: 14,
  },
  fundBenefitText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerLinksBox: {
    alignItems: 'center',
    paddingBottom: 16,
    gap: 6,
  },
  footerCompanyName: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footerLegalLinks: {
    fontSize: 11,
    color: Colors.forestGreenDark,
    fontWeight: '700',
  },
  footerDisclaimer: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

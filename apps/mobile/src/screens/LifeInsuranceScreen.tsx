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
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// ==========================================
// SVG ICONS & ILLUSTRATIONS
// ==========================================

function FamilyUmbrellaGraphic() {
  return (
    <Svg width={140} height={100} viewBox="0 0 140 100" fill="none">
      <Defs>
        <LinearGradient id="umbrellaGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#F472B6" />
          <Stop offset="100%" stopColor="#EC4899" />
        </LinearGradient>
        <LinearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#34D399" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Background Hills */}
      <Path d="M0 90 Q 70 65 140 90 L 140 100 L 0 100 Z" fill="#064E3B" opacity={0.6} />
      <Path d="M0 82 Q 70 55 140 82 L 140 100 L 0 100 Z" fill="#047857" opacity={0.4} />

      {/* Protective Umbrella */}
      <Path
        d="M 60 28 C 60 12, 125 12, 125 28 C 114 26, 103 28, 92 28 C 81 28, 71 26, 60 28 Z"
        fill="url(#umbrellaGrad)"
      />
      {/* Umbrella Stick & Handle */}
      <Path d="M92 28 V 50 C 92 53 89 55 86 55" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round" />

      {/* Safety Shield */}
      <G transform="translate(48, 22)">
        <Path d="M 0 0 L 10 0 C 10 9 5 15 0 18 C -5 15 -10 9 -10 0 Z" fill="url(#shieldGrad)" />
        <Path d="M -4 8 L -1 11 L 5 4" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </G>

      {/* Little Sparkles / Stars */}
      <Circle cx="44" cy="42" r="1.5" fill="#FDE047" />
      <Circle cx="130" cy="38" r="1.5" fill="#FDE047" />

      {/* Child Figure */}
      <G transform="translate(68, 55)">
        <Circle cx="5" cy="5" r="4.5" fill="#FDBA74" />
        <Rect x="0" y="11" width="10" height="11" rx="2" fill="#38BDF8" />
        <Path d="M 2 22 V 32 M 8 22 V 32" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </G>

      {/* Mother Figure */}
      <G transform="translate(82, 42)">
        <Circle cx="6" cy="5" r="5" fill="#FDBA74" />
        {/* Hair */}
        <Path d="M 0 5 C 0 0 12 0 12 5 C 12 8 10 9 8 9 H 4 C 2 9 0 8 0 5 Z" fill="#7C2D12" />
        {/* Dress */}
        <Path d="M 2 12 L 0 30 H 12 L 10 12 Z" fill="#F472B6" />
        <Path d="M 3 30 V 42 M 9 30 V 42" stroke="#F8FAFC" strokeWidth="2.2" strokeLinecap="round" />
      </G>

      {/* Father Figure */}
      <G transform="translate(100, 36)">
        <Circle cx="6" cy="5" r="5.5" fill="#FDBA74" />
        {/* Hair */}
        <Path d="M 0 4 C 0 -1 12 -1 12 4 Z" fill="#1E293B" />
        {/* Shirt */}
        <Rect x="0" y="12" width="12" height="18" rx="3" fill="#60A5FA" />
        {/* Trousers */}
        <Path d="M 2 30 V 48 M 10 30 V 48" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
      </G>
    </Svg>
  );
}

function TermInsuranceIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8 6 6 8.5 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.5 16 6 12 2Z"
        stroke="#10B981"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 15C3 18.5 6 21 12 21C18 21 21 18.5 21 15"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="12" r="2" fill="#10B981" />
    </Svg>
  );
}

function UlipIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22S4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z"
        stroke="#3B82F6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 13L11 10L13 12L16 8"
        stroke="#3B82F6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13 8H16V11" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PensionIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="5" r="3" stroke="#F59E0B" strokeWidth="1.8" />
      <Path
        d="M9 11L11 10L13 14L11 22"
        stroke="#F59E0B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11 14L14 18L13 22" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 13V22" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function PayPremiumIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#8B5CF6" strokeWidth="1.8" />
      <Path
        d="M12 7V12L15 15"
        stroke="#8B5CF6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 3.5L12 2L15 3.5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PriceTagIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.59 13.41L13.42 20.58C13.04 20.96 12.54 21.17 12 21.17C11.46 21.17 10.96 20.96 10.58 20.59L3.41 13.41C3.04 13.04 2.83 12.54 2.83 12V4C2.83 2.9 3.73 2 4.83 2H12.83C13.37 2 13.87 2.21 14.24 2.59L20.59 8.94C21.37 9.72 21.37 11 20.59 11.78L20.59 13.41Z"
        stroke="#10B981"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="7.5" cy="7.5" r="1.5" fill="#10B981" />
    </Svg>
  );
}

function HeartHandIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        fill="#EC4899"
      />
    </Svg>
  );
}

function ShieldCheckIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22S4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z"
        fill="#3B82F6"
      />
      <Path d="M9 12L11 14L15 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color = '#94A3B8' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ==========================================
// SCREEN COMPONENT
// ==========================================

export function LifeInsuranceScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handlePlanClick = (title: string, subtitle: string) => {
    Alert.alert(
      title,
      `${subtitle}\n\n• Instant policy issue in 2 mins\n• 0% GST saving on premium\n• Dedicated claims manager for lifetime\n• Tax deduction under Sec 80C & 10(10D)`,
      [{ text: 'Explore Quotes', style: 'default' }]
    );
  };

  const handlePayPremium = () => {
    Alert.alert(
      'Pay Policy Premium',
      'Select your life insurer (LIC, HDFC Life, ICICI Prudential, SBI Life, Max Life, etc.) to pay your renewal premium instantly with 0 convenience fee.',
      [{ text: 'Proceed', style: 'default' }]
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

        <Text style={styles.headerTitle}>Life Insurance</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert(
              'Life Insurance Assistance',
              'SmartWallet offers 100% tax-free ₹1 Crore life covers with 0% GST, instant payout guarantee, and 24x7 family claim support.'
            );
          }}
          activeOpacity={0.7}
        >
          <QuestionHelpIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== HERO PROMO BANNER ==================== */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroSubtitle}>LIFE INSURANCE</Text>
            <Text style={styles.heroTitle}>Plans for all your needs</Text>

            <View style={styles.benefitRow}>
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.benefitText}>Choose plan based on needs</Text>
            </View>
            <View style={styles.benefitRow}>
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.benefitText}>0% GST on all plans</Text>
            </View>
          </View>

          <View style={styles.heroGraphicCol}>
            <FamilyUmbrellaGraphic />
          </View>
        </View>

        {/* ==================== 3 CORE PLANS ==================== */}
        <View style={styles.plansContainer}>
          {/* Plan 1: Term Life Insurance */}
          <TouchableOpacity
            style={styles.planCard}
            onPress={() =>
              handlePlanClick(
                'Term Life Insurance',
                'Secure your family’s future with ₹1 Cr life cover at just ₹435/month'
              )
            }
            activeOpacity={0.8}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: '#ECFDF5' }]}>
              <TermInsuranceIcon />
            </View>
            <View style={styles.planTextWrapper}>
              <Text style={styles.planName}>Term Life Insurance</Text>
              <Text style={styles.planSubtext}>Secure your family's future with</Text>
              <Text style={styles.planHighlight}>₹1 Cr life cover at just ₹435/month</Text>
            </View>
            <ChevronRightIcon color="#94A3B8" />
          </TouchableOpacity>

          {/* Plan 2: ULIP/LIC Plans */}
          <TouchableOpacity
            style={styles.planCard}
            onPress={() =>
              handlePlanClick(
                'ULIP / Savings Plans',
                'Grow your wealth with market returns. Get tax-free ₹1 Cr with just ₹5k/month'
              )
            }
            activeOpacity={0.8}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <UlipIcon />
            </View>
            <View style={styles.planTextWrapper}>
              <Text style={styles.planName}>ULIP/LIC Plans</Text>
              <Text style={styles.planSubtext}>Grow your wealth with market returns</Text>
              <Text style={styles.planHighlight}>Get tax-free ₹1 Cr with just ₹5k/month</Text>
            </View>
            <ChevronRightIcon color="#94A3B8" />
          </TouchableOpacity>

          {/* Plan 3: Pension Plan */}
          <TouchableOpacity
            style={styles.planCard}
            onPress={() =>
              handlePlanClick(
                'Guaranteed Pension Plan',
                'Secure your dream retirement today. Get ₹50k monthly with just ₹5k/month'
              )
            }
            activeOpacity={0.8}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: '#FFFBEB' }]}>
              <PensionIcon />
            </View>
            <View style={styles.planTextWrapper}>
              <Text style={styles.planName}>Pension Plan</Text>
              <Text style={styles.planSubtext}>Secure your dream retirement today</Text>
              <Text style={styles.planHighlight}>Get ₹50k monthly with just ₹5k/month</Text>
            </View>
            <ChevronRightIcon color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ==================== ALREADY HAVE A POLICY ==================== */}
        <View style={styles.existingPolicySection}>
          <Text style={styles.sectionHeaderLabel}>ALREADY HAVE A POLICY?</Text>
          <TouchableOpacity
            style={styles.payPremiumCard}
            onPress={handlePayPremium}
            activeOpacity={0.8}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: '#F5F3FF' }]}>
              <PayPremiumIcon />
            </View>
            <View style={styles.planTextWrapper}>
              <Text style={styles.planName}>Pay your premium</Text>
              <Text style={styles.planSubtext}>Pay premium for any insurance policy</Text>
            </View>
            <ChevronRightIcon color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ==================== INSURANCE YOUR WAY ==================== */}
        <View style={styles.yourWaySection}>
          <Text style={styles.yourWayTitle}>Insurance Your Way</Text>

          <View style={styles.featuresRow}>
            {/* Feature 1 */}
            <View style={styles.featureItem}>
              <View style={styles.featureIconBubble}>
                <PriceTagIcon />
              </View>
              <Text style={styles.featureText}>Attractive{'\n'}pricing</Text>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureItem}>
              <View style={styles.featureIconBubble}>
                <HeartHandIcon />
              </View>
              <Text style={styles.featureText}>Handpicked{'\n'}plans</Text>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureItem}>
              <View style={styles.featureIconBubble}>
                <ShieldCheckIcon />
              </View>
              <Text style={styles.featureText}>Easy purchase{'\n'}process</Text>
            </View>
          </View>
        </View>

        {/* ==================== LEGAL & FOOTER ==================== */}
        <View style={styles.legalFooter}>
          <Text style={styles.legalText}>
            SmartWallet Insurance Broking Services Private Limited. IRDAI Direct Broker (Life & General) Reg. 766 and Broker Registration Code IRDA/DB 822/20 Valid till 10/08/2027.
          </Text>
          <Text style={styles.legalText}>
            Tax benefits are subject to provisions under Income Tax Act 1961 (Section 80C & 10(10D)). GST waiver subject to prevailing insurer rules.
          </Text>
          <View style={styles.legalLinksRow}>
            <TouchableOpacity onPress={() => Alert.alert('T&C', 'Terms & Conditions')}>
              <Text style={styles.legalLink}>T&Cs</Text>
            </TouchableOpacity>
            <Text style={styles.legalDot}>•</Text>
            <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'SmartWallet Privacy Policy')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalDot}>•</Text>
            <TouchableOpacity onPress={() => Alert.alert('Grievance', 'SmartWallet Grievance Policy')}>
              <Text style={styles.legalLink}>Grievance Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  helpButton: {
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Banner
  heroBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  heroSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  benefitText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  heroGraphicCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Plan Cards
  plansContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  planIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  planSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  planHighlight: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.forestGreen,
  },

  // Existing policy
  existingPolicySection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  payPremiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  // Insurance Your Way
  yourWaySection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  yourWayTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Legal footer
  legalFooter: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.forestGreen,
  },
  legalDot: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

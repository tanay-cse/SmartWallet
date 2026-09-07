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

// Hero Free Credit Score Vector Gauge & Coin Stacks
function CreditScoreHeroGauge() {
  return (
    <Svg width="100%" height={190} viewBox="0 0 340 190" fill="none">
      <Defs>
        <LinearGradient id="darkBackdrop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#1E1B4B" />
          <Stop offset="100%" stopColor="#0F172A" />
        </LinearGradient>
      </Defs>

      {/* Dark Curved Backdrop */}
      <Rect width="340" height="190" rx="22" fill="url(#darkBackdrop)" />

      {/* Rainbow Speedometer Arc */}
      <Path
        d="M50 160C50 93.7 103.7 40 170 40C236.3 40 290 93.7 290 160"
        stroke="#312E81"
        strokeWidth="18"
        strokeLinecap="round"
      />
      {/* Orange Zone */}
      <Path
        d="M50 160C50 120 75 88 110 70"
        stroke="#F97316"
        strokeWidth="18"
        strokeLinecap="round"
      />
      {/* Yellow/Amber Zone */}
      <Path
        d="M110 70C128 60 148 55 170 55"
        stroke="#FBBF24"
        strokeWidth="18"
      />
      {/* Green High-Score Zone */}
      <Path
        d="M170 55C214 55 255 85 290 160"
        stroke="#10B981"
        strokeWidth="18"
        strokeLinecap="round"
      />

      {/* Sparkles */}
      <Path d="M40 50L42 56L48 58L42 60L40 66L38 60L32 58L38 56Z" fill="#FDE047" />
      <Path d="M310 70L311.5 74L316 75.5L311.5 77L310 81L308.5 77L304 75.5L308.5 74Z" fill="#FDE047" />

      {/* Money Bag on Left */}
      <Circle cx="45" cy="140" r="22" fill="#A855F7" />
      <Path d="M35 124C35 120 40 118 45 118C50 118 55 120 55 124L58 132C58 135 52 136 45 136C38 136 32 135 32 132Z" fill="#9333EA" />
      <SvgText x="45" y="146" fontSize="14" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</SvgText>

      {/* Stacked Gold Coins on Right */}
      <Rect x="270" y="110" width="46" height="12" rx="4" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1" />
      <Rect x="268" y="122" width="48" height="12" rx="4" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
      <Rect x="266" y="134" width="50" height="14" rx="4" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1" />
      <Circle cx="260" cy="150" r="14" fill="#FBBF24" stroke="#FDE68A" strokeWidth="1" />
      <SvgText x="260" y="154" fontSize="10" fontWeight="bold" fill="#78350F" textAnchor="middle">₹</SvgText>

      {/* Center Text in Arc */}
      <SvgText x="170" y="88" fontSize="12" fontWeight="600" fill="#CBD5E1" textAnchor="middle">Check your</SvgText>
      <SvgText x="170" y="112" fontSize="18" fontWeight="900" fill="#FFFFFF" textAnchor="middle">Credit Score</SvgText>
      <SvgText x="170" y="134" fontSize="18" fontWeight="900" fill="#6EE7B7" textAnchor="middle">for FREE</SvgText>
      <SvgText x="170" y="155" fontSize="11" fontWeight="600" fill="#94A3B8" textAnchor="middle">Limited period offer!</SvgText>
    </Svg>
  );
}

export function CreditScoreScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleCheckCreditScore = () => {
    Alert.alert(
      'Credit Score Report',
      'Fetching live CIR report from Experian & CRIF High Mark for linked number 6377739077...\n\nYour Credit Score: 785 (Excellent)\nLoan Eligibility: Pre-approved up to ₹10,00,000.',
      [{ text: 'View Full Report', style: 'default' }]
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
            Alert.alert('Credit Score Help', 'Check your official Experian & CRIF High Mark credit score with zero impact on your score.');
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
        {/* Hero Gauge Card */}
        <View style={styles.heroCardContainer}>
          <CreditScoreHeroGauge />
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeading}>Why check your credit score on SmartWallet</Text>

        {/* Feature 1 */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: '#FDF2F8' }]}>
            <Text style={{ fontSize: 24 }}>🏷️</Text>
          </View>
          <Text style={styles.featureText}>Get personalised loan offers</Text>
        </View>

        {/* Feature 2 */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={{ fontSize: 24 }}>🔍</Text>
          </View>
          <Text style={styles.featureText}>Get summarised credit insights</Text>
        </View>

        {/* Feature 3 */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={{ fontSize: 24 }}>🛡️</Text>
          </View>
          <Text style={styles.featureText}>No impact on your credit score</Text>
        </View>

        {/* Bureau Link Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Note: </Text>
          <Text style={styles.noteDesc}>
            Bureau will fetch the credit score linked to <Text style={styles.phoneHighlight}>6377739077</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={styles.checkScoreBtn}
          onPress={handleCheckCreditScore}
          activeOpacity={0.88}
        >
          <Text style={styles.checkScoreText}>Check Credit Score</Text>
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
    paddingTop: 6,
    paddingBottom: 110,
  },
  heroCardContainer: {
    marginBottom: 24,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
    gap: 14,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  noteLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.warning,
  },
  noteDesc: {
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
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
  checkScoreBtn: {
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
  checkScoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

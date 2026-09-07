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

// Bike Gift Banner SVG Graphic
function BikeGiftGraphic() {
  return (
    <Svg width={120} height={80} viewBox="0 0 120 80" fill="none">
      {/* Bike Body */}
      <Circle cx="30" cy="55" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
      <Circle cx="95" cy="55" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
      <Path d="M30 55L50 40H75L95 55" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M60 40L65 24H72" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
      <Path d="M45 42L40 32H35" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
      {/* Big Gift Ribbon Bow */}
      <Path d="M65 14C60 8 50 10 54 18C58 26 65 30 65 30Z" fill="#F43F5E" />
      <Path d="M65 14C70 8 80 10 76 18C72 26 65 30 65 30Z" fill="#F43F5E" />
      <Circle cx="65" cy="20" r="4" fill="#FB7185" />
      {/* Ribbon tail */}
      <Path d="M65 24V50" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

const PARTNERS = [
  'ACKO',
  'BAJAJ ALLIANZ',
  'HDFC ERGO',
  'ICICI LOMBARD',
  'ORIENTAL INS',
  'NEW INDIA',
  'TATA AIG',
  'DIGIT',
];

export function BikeInsuranceScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [regNumber, setRegNumber] = useState('');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleFindPlans = () => {
    if (!regNumber.trim()) {
      Alert.alert('Vehicle Number Required', 'Please enter your bike/scooter registration number (e.g. KA01KA1234).');
      return;
    }
    Alert.alert(
      'Comparing Bike Plans',
      `Fetching verified quotes for ${regNumber.toUpperCase()} from 15+ top IRDAI insurers. Comprehensive plans starting @ ₹538/year with zero depreciation.`,
      [{ text: 'View Quotes', style: 'default' }]
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

        <Text style={styles.headerTitle}>Bike Insurance</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Bike Insurance Help', 'Instant paperless 2-wheeler insurance renewal with zero vehicle inspection and cashless garage network.');
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
        {/* Registration Input Box */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>Enter bike/scooter number</Text>
          <Text style={styles.inputSubtitle}>Compare plans from multiple insurers</Text>

          <TextInput
            style={styles.regInput}
            placeholder="Eg. KA01KA1234"
            placeholderTextColor={Colors.textMuted}
            value={regNumber}
            onChangeText={(t) => setRegNumber(t.toUpperCase())}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={styles.findPlansBtn}
            onPress={handleFindPlans}
            activeOpacity={0.88}
          >
            <Text style={styles.findPlansText}>Find Plans</Text>
          </TouchableOpacity>

          <Text style={styles.consentText}>
            By proceeding, you allow us to call you to provide insurance assistance
          </Text>
        </View>

        {/* Buying new bike banner */}
        <TouchableOpacity
          style={styles.newBikeBanner}
          onPress={() => Alert.alert('New Bike Insurance', 'Get up to 95% discount on own damage cover for new bikes.')}
          activeOpacity={0.85}
        >
          <View style={styles.newBikeTextCol}>
            <Text style={styles.newBikeHeading}>Buying a brand new bike?</Text>
            <Text style={styles.newBikeDiscount}>Save up to 95%</Text>
            <Text style={styles.insureNowLink}>Insure Now ➔</Text>
          </View>
          <BikeGiftGraphic />
        </TouchableOpacity>

        {/* Social Proof Reviews */}
        <View style={styles.sectionBox}>
          <Text style={styles.socialProofHeading}>1 Cr+ Indians chose us</Text>
          <Text style={styles.socialProofSub}>Hear what our customers have to say</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
            {/* Review 1 */}
            <View style={styles.reviewCard}>
              <View style={[styles.reviewAvatar, { backgroundColor: '#EC4899' }]}>
                <Text style={styles.avatarInitials}>SJ</Text>
              </View>
              <Text style={styles.reviewBody}>
                SmartWallet's claim process was excellent. I've already renewed for next year. I will insure my other vehicles here too!
              </Text>
              <Text style={styles.reviewerName}>Shahjahan</Text>
            </View>

            {/* Review 2 */}
            <View style={styles.reviewCard}>
              <View style={[styles.reviewAvatar, { backgroundColor: '#F43F5E' }]}>
                <Text style={styles.avatarInitials}>Rk</Text>
              </View>
              <Text style={styles.reviewBody}>
                The process was quick and customer support team helped me claim cashless repair within 2 hours!
              </Text>
              <Text style={styles.reviewerName}>Rajkumar</Text>
            </View>
          </ScrollView>
        </View>

        {/* Trusted Partners Badges */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionSubHeading}>OUR TRUSTED PARTNERS</Text>
          <View style={styles.partnersGrid}>
            {PARTNERS.map((p) => (
              <View key={p} style={styles.partnerBadge}>
                <Text style={styles.partnerBadgeText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4 Steps Progress */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsSectionTitle}>Faster Insurance, Fewer Steps</Text>
          <View style={styles.stepsRow}>
            {[
              { n: '1', l: 'Choose\nplan' },
              { n: '2', l: 'Submit\ndetails' },
              { n: '3', l: 'Complete\nKYC' },
              { n: '4', l: 'Get your\npolicy' },
            ].map((st) => (
              <View key={st.n} style={styles.stepCol}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepCircleNum}>{st.n}</Text>
                </View>
                <Text style={styles.stepLabel}>{st.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer IRDAI Disclaimer */}
        <Text style={styles.legalFooterText}>
          SmartWallet Insurance Broking Services Private Limited. IRDAI Direct Broker (Life & General) Reg. 766 and Broker Registration Code IRDA/DB 822/20 Valid till 10/08/2027.
        </Text>
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
    paddingBottom: 40,
  },
  inputCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  inputSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  regInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: 1,
  },
  findPlansBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  findPlansText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  consentText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
  newBikeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1810',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  newBikeTextCol: {
    flex: 1,
  },
  newBikeHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  newBikeDiscount: {
    fontSize: 12,
    color: '#FDBA74',
    marginBottom: 10,
  },
  insureNowLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#86EFAC',
  },
  sectionBox: {
    marginBottom: 20,
  },
  socialProofHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  socialProofSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  reviewsScroll: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: 250,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  reviewBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partnerBadge: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepsSection: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20,
  },
  stepsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
    textAlign: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleNum: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestGreenDark,
  },
  stepLabel: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '600',
  },
  legalFooterText: {
    fontSize: 10.5,
    color: Colors.textMuted,
    lineHeight: 15,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

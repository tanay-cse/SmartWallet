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
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Car Gift Banner SVG Graphic
function CarGiftGraphic() {
  return (
    <Svg width={120} height={80} viewBox="0 0 120 80" fill="none">
      {/* Car Body */}
      <Path d="M20 54L30 36H85L98 54H20Z" fill="#0284C7" />
      <Path d="M14 54H104V64C104 66 102 67 100 67H18C16 67 14 66 14 64V54Z" fill="#0369A1" />
      <Circle cx="35" cy="65" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <Circle cx="85" cy="65" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      {/* Windows */}
      <Path d="M36 50L44 39H60V50H36Z" fill="#E0F2FE" />
      <Path d="M64 39H78L86 50H64V39Z" fill="#E0F2FE" />
      {/* Big Gift Ribbon Bow */}
      <Path d="M60 20C55 14 45 16 49 24C53 32 60 36 60 36Z" fill="#F43F5E" />
      <Path d="M60 20C65 14 75 16 71 24C67 32 60 36 60 36Z" fill="#F43F5E" />
      <Circle cx="60" cy="26" r="3.5" fill="#FB7185" />
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

export function CarInsuranceScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [regNumber, setRegNumber] = useState('');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleFindCarPlans = () => {
    if (!regNumber.trim()) {
      Alert.alert('Vehicle Number Required', 'Please enter your car registration number (e.g. DL01AB1234).');
      return;
    }
    Alert.alert(
      'Comparing Car Insurance',
      `Fetching quotes for ${regNumber.toUpperCase()} with up to 85% NCB discount, Zero Depreciation, Engine Protect, and 5000+ cashless network garages.`,
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

        <Text style={styles.headerTitle}>Car Insurance</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Car Insurance Help', 'Get comprehensive 4-wheeler cover with zero paperwork, instant policy delivery, and priority claims support.');
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
          <Text style={styles.inputTitle}>Enter car registration number</Text>
          <Text style={styles.inputSubtitle}>Save up to 85% with zero-depreciation & cashless claims</Text>

          <TextInput
            style={styles.regInput}
            placeholder="Eg. DL01AB1234"
            placeholderTextColor={Colors.textMuted}
            value={regNumber}
            onChangeText={(t) => setRegNumber(t.toUpperCase())}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={styles.findPlansBtn}
            onPress={handleFindCarPlans}
            activeOpacity={0.88}
          >
            <Text style={styles.findPlansText}>View Car Quotes</Text>
          </TouchableOpacity>

          <Text style={styles.consentText}>
            By proceeding, you allow us to call you to provide insurance assistance
          </Text>
        </View>

        {/* Buying new car banner */}
        <TouchableOpacity
          style={styles.newCarBanner}
          onPress={() => Alert.alert('New Car Insurance', 'Save up to 85% on own damage premium for brand new cars.')}
          activeOpacity={0.85}
        >
          <View style={styles.newCarTextCol}>
            <Text style={styles.newCarHeading}>Buying a brand new car?</Text>
            <Text style={styles.newCarDiscount}>Get dealer match discount</Text>
            <Text style={styles.insureNowLink}>Insure Now ➔</Text>
          </View>
          <CarGiftGraphic />
        </TouchableOpacity>

        {/* Social Proof Reviews */}
        <View style={styles.sectionBox}>
          <Text style={styles.socialProofHeading}>1 Cr+ Indians chose us</Text>
          <Text style={styles.socialProofSub}>Hear what our customers have to say</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
            <View style={styles.reviewCard}>
              <View style={[styles.reviewAvatar, { backgroundColor: '#EC4899' }]}>
                <Text style={styles.avatarInitials}>SJ</Text>
              </View>
              <Text style={styles.reviewBody}>
                SmartWallet's claim process was excellent. I've already renewed for next year. I will insure my other vehicles here too!
              </Text>
              <Text style={styles.reviewerName}>Shahjahan</Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={[styles.reviewAvatar, { backgroundColor: '#F43F5E' }]}>
                <Text style={styles.avatarInitials}>Rk</Text>
              </View>
              <Text style={styles.reviewBody}>
                The process was quick and customer support team settled my windshield claim within 24 hours without physical inspection.
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
  newCarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2844', // Sleek dark navy/sapphire card
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  newCarTextCol: {
    flex: 1,
  },
  newCarHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  newCarDiscount: {
    fontSize: 12,
    color: '#93C5FD',
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

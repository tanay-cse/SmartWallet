import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRightIcon } from '../components/icons/BudgetIcons';
import { BankBuildingIcon, ChevronLeftIcon } from '../components/icons/TabIcon';
import { ToBankIcon, ToMobileIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

type RecentBeneficiary = {
  id: string;
  name: string;
  upiId: string;
  initials: string;
  bankName: string;
  avatarBg: string;
};

const MOCK_RECENTS: RecentBeneficiary[] = [
  {
    id: '1',
    name: 'Raghav Gupta',
    upiId: 'raghavgupta07159@okaxis',
    initials: 'RG',
    bankName: 'Axis Bank •••• 4120',
    avatarBg: '#1E293B',
  },
  {
    id: '2',
    name: 'Naman Sharma',
    upiId: 'namsh70747@oksbi',
    initials: 'NS',
    bankName: 'State Bank of India •••• 8821',
    avatarBg: '#065F46',
  },
  {
    id: '3',
    name: 'Pooja Mehra',
    upiId: 'poojam@icici',
    initials: 'PM',
    bankName: 'ICICI Bank •••• 0934',
    avatarBg: '#1E3A8A',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    upiId: 'vikram.singh@hdfcbank',
    initials: 'VS',
    bankName: 'HDFC Bank •••• 5519',
    avatarBg: '#334155',
  },
];

export function TransferMethodScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [upiInput, setUpiInput] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleBeneficiaryPress = (item: RecentBeneficiary) => {
    Alert.alert(
      `Transfer to ${item.name}`,
      `UPI ID: ${item.upiId}\nBank: ${item.bankName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Money',
          style: 'default',
          onPress: () => {
            Alert.alert('Payment Window', `Opening secure UPI transfer for ${item.name}...`);
          },
        },
      ]
    );
  };

  const handleSendToUpi = () => {
    Alert.prompt
      ? Alert.prompt(
          'Send to UPI ID or Number',
          'Enter recipient UPI ID (e.g. name@okhdfcbank) or 10-digit UPI number:',
          (val) => {
            if (val) {
              Alert.alert('Validating UPI ID', `Verifying ${val} with NPCI switch...`);
            }
          }
        )
      : Alert.alert('Send to UPI', 'Enter UPI ID or registered mobile number.');
  };

  const handleSendToSelf = () => {
    Alert.alert(
      'Self Account Transfer',
      'Select your destination account:\n1. HDFC Salary A/C (•••• 4920)\n2. ICICI Savings A/C (•••• 1029)\n3. SBI Emergency Vault (•••• 8821)',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', style: 'default' },
      ]
    );
  };

  const handleBankTransfer = () => {
    Alert.alert(
      'Bank Account Transfer',
      'Enter Account Number & IFSC code for instant IMPS / NEFT transfer with 0 fees.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enter Details', style: 'default' },
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

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Heading */}
        <Text style={styles.mainHeading}>How do you want to transfer the amount</Text>

        {/* ==================== 1. HERO CARD: SEND TO UPI ID ==================== */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={handleSendToUpi}
          activeOpacity={0.85}
        >
          <View style={styles.heroCardContent}>
            <View style={styles.heroIconCircle}>
              <ToMobileIcon size={32} />
            </View>

            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>Send to UPI ID or UPI Number</Text>
              <Text style={styles.heroSubtitle}>Pay to any UPI using UPI ID or UPI number</Text>
            </View>
          </View>

          {/* Bottom Brand Badges */}
          <View style={styles.heroBadgesRow}>
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>BHIM</Text>
            </View>
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>GPay</Text>
            </View>
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>PhonePe</Text>
            </View>
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>Paytm</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ==================== 2. GRID ROW: SELF & BANK TRANSFER ==================== */}
        <View style={styles.gridRow}>
          {/* Card A: Send to Self */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={handleSendToSelf}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: Colors.forestGreenLight }]}>
              <Text style={{ fontSize: 24 }}>🔄</Text>
            </View>
            <Text style={styles.gridTitle}>Send to Self</Text>
            <Text style={styles.gridSubtitle}>Between own accounts</Text>
          </TouchableOpacity>

          {/* Card B: Bank Transfer */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={handleBankTransfer}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: Colors.navyBlueSubtle }]}>
              <ToBankIcon size={26} />
            </View>
            <Text style={styles.gridTitle}>Bank Transfer</Text>
            <Text style={styles.gridSubtitle}>Using A/C & IFSC</Text>
          </TouchableOpacity>
        </View>

        {/* ==================== 3. RECENTS SECTION ==================== */}
        <View style={styles.recentsHeaderRow}>
          <Text style={styles.recentsHeading}>Recents ✦</Text>
          <View style={styles.recentsLine} />
        </View>

        <View style={styles.recentsList}>
          {MOCK_RECENTS.map((beneficiary) => (
            <TouchableOpacity
              key={beneficiary.id}
              style={styles.beneficiaryCard}
              onPress={() => handleBeneficiaryPress(beneficiary)}
              activeOpacity={0.8}
            >
              <View style={[styles.beneficiaryAvatar, { backgroundColor: beneficiary.avatarBg }]}>
                <Text style={styles.beneficiaryInitials}>{beneficiary.initials}</Text>
              </View>

              <View style={styles.beneficiaryInfo}>
                <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
                <Text style={styles.beneficiaryUpi}>{beneficiary.upiId}</Text>
              </View>

              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  heroCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  miniBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  gridIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  recentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  recentsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  recentsLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  recentsList: {
    gap: 12,
  },
  beneficiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  beneficiaryAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficiaryInitials: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  beneficiaryUpi: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

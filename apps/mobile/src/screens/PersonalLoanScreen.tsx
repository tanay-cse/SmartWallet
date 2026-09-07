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
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRightIcon } from '../components/icons/BudgetIcons';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Partner Lender SVG Logos
function LenderLogo({ name, color = '#0284C7', size = 42 }: { name: string; color?: string; size?: number }) {
  if (name === 'InstaMoney') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
        <Circle cx="20" cy="20" r="12" fill="#0284C7" />
        <SvgText x="20" y="24" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle">IM</SvgText>
      </Svg>
    );
  }
  if (name === 'Moneyview') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#0F172A" />
        <Path d="M12 26L16 14L20 22L24 14L28 26" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === 'Ring') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
        <Circle cx="20" cy="20" r="10" stroke="#2563EB" strokeWidth="3" />
      </Svg>
    );
  }
  // KreditBee
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="10" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
      <Circle cx="20" cy="20" r="10" fill="#D97706" />
      <SvgText x="20" y="24" fontSize="9" fontWeight="900" fill="#FFFFFF" textAnchor="middle">KB</SvgText>
    </Svg>
  );
}

type LoanPartner = {
  id: string;
  name: string;
  subtitle: string;
  maxAmount: string;
  timeEstimate: string;
};

const LOAN_PARTNERS: LoanPartner[] = [
  {
    id: 'p1',
    name: 'InstaMoney',
    subtitle: 'Unlock cash in 2 mins. Loans from ₹5,000',
    maxAmount: '₹50,000',
    timeEstimate: '2 mins',
  },
  {
    id: 'p2',
    name: 'Moneyview',
    subtitle: 'Get up to ₹10 lakhs in 10 mins!',
    maxAmount: '₹10,00,000',
    timeEstimate: '10 mins',
  },
  {
    id: 'p3',
    name: 'Ring',
    subtitle: 'Get instant loan up to ₹5 lakhs in 5 mins',
    maxAmount: '₹5,00,000',
    timeEstimate: '5 mins',
  },
  {
    id: 'p4',
    name: 'KreditBee',
    subtitle: 'Instant loan from ₹6,000 to ₹10 Lakh',
    maxAmount: '₹10,00,000',
    timeEstimate: 'Instant',
  },
];

export function PersonalLoanScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleApplyPartner = (partner: LoanPartner) => {
    Alert.alert(
      `Apply with ${partner.name}`,
      `Limit: Up to ${partner.maxAmount}\nApproval: ${partner.timeEstimate}\nInterest starting @ 1.25% per month. 100% paperless KYC.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Eligibility',
          style: 'default',
          onPress: () => {
            Alert.alert('Eligibility Check', `Verifying credit profile with ${partner.name}...`);
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

        <Text style={styles.headerTitle}>Personal Loans</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Personal Loan Help', 'Get instant pre-approved personal loans disbursed directly into your bank account with zero collateral.');
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
        {/* Partners Card Block */}
        <View style={styles.cardContainer}>
          {LOAN_PARTNERS.map((partner, index) => (
            <TouchableOpacity
              key={partner.id}
              style={[
                styles.partnerRow,
                index < LOAN_PARTNERS.length - 1 && styles.partnerRowBorder,
              ]}
              onPress={() => handleApplyPartner(partner)}
              activeOpacity={0.75}
            >
              <LenderLogo name={partner.name} size={42} />

              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerSubtitle}>{partner.subtitle}</Text>
              </View>

              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Disclaimer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            SmartWallet Lending Services Private Limited. T&Cs apply.
          </Text>
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
  cardContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  partnerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  partnerSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  footerContainer: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11.5,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
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
  Text as SvgText,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// ==========================================
// SVG ICONS & ILLUSTRATIONS
// ==========================================

function ShareIcon({ size = 20, color = Colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
      <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function CoinStackMedalGraphic() {
  return (
    <Svg width={110} height={85} viewBox="0 0 110 85" fill="none">
      <Defs>
        <LinearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
        <LinearGradient id="medalGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#BE123C" />
        </LinearGradient>
      </Defs>

      {/* Coin Stacks (Left) */}
      <G transform="translate(15, 30)">
        <Rect x="0" y="24" width="30" height="8" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="16" width="30" height="8" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="8" width="30" height="8" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="0" width="30" height="8" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
      </G>

      {/* Coin Stacks (Right) */}
      <G transform="translate(48, 20)">
        <Rect x="0" y="32" width="34" height="9" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="24" width="34" height="9" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="16" width="34" height="9" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="8" width="34" height="9" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
        <Rect x="0" y="0" width="34" height="9" rx="4" fill="url(#coinGrad)" stroke="#D97706" strokeWidth="1" />
      </G>

      {/* Star Medal with Ribbons */}
      <G transform="translate(68, 12)">
        {/* Ribbons */}
        <Path d="M4 22 L0 36 L8 32 L16 36 L12 22 Z" fill="#6366F1" />
        <Path d="M12 22 L16 36 L24 32 L32 36 L28 22 Z" fill="#4F46E5" />
        {/* Medal Badge */}
        <Circle cx="16" cy="16" r="14" fill="url(#medalGrad)" />
        {/* Star */}
        <Path
          d="M16 8L18.5 13L24 13.8L20 17.7L21 23L16 20.4L11 23L12 17.7L8 13.8L13.5 13L16 8Z"
          fill="#FFFFFF"
        />
      </G>

      {/* Green growth sprouts */}
      <Path d="M26 26C24 18 32 16 34 22C36 16 44 18 42 26" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
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

function GridExploreIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="7" cy="7" r="3" stroke="#8B5CF6" strokeWidth="2" />
      <Circle cx="17" cy="7" r="3" stroke="#8B5CF6" strokeWidth="2" />
      <Circle cx="7" cy="17" r="3" stroke="#8B5CF6" strokeWidth="2" />
      <Circle cx="17" cy="17" r="3" stroke="#8B5CF6" strokeWidth="2" />
    </Svg>
  );
}

function FundLogoBadge({ code, bg }: { code: string; bg: string }) {
  return (
    <View style={[styles.fundLogoContainer, { backgroundColor: bg }]}>
      <Text style={styles.fundLogoText}>{code}</Text>
    </View>
  );
}

// ==========================================
// DATA
// ==========================================

type FundItem = {
  id: string;
  name: string;
  category: string;
  code: string;
  bgColor: string;
  last5Y: string;
  minInvest: string;
  fundSize: string;
};

const CHOTI_SIP_FUNDS: FundItem[] = [
  {
    id: 'hdfc_focused',
    name: 'HDFC Focused Fund',
    category: 'Equity: Focused',
    code: 'HDFC',
    bgColor: '#DC2626',
    last5Y: '17.3% p.a',
    minInvest: '₹250',
    fundSize: '₹27,924.77Cr',
  },
  {
    id: 'icici_multi_asset',
    name: 'ICICI Prudential Multi Asset Allocation Fund',
    category: 'Hybrid: Multi Asset Allocation',
    code: 'ICICI',
    bgColor: '#C2410C',
    last5Y: '15.97% p.a',
    minInvest: '₹250',
    fundSize: '₹86,785.03Cr',
  },
  {
    id: 'kotak_contra',
    name: 'Kotak Contra Fund',
    category: 'Equity: Contra',
    code: 'KOTAK',
    bgColor: '#E11D48',
    last5Y: '13.29% p.a',
    minInvest: '₹250',
    fundSize: '₹5,449.88Cr',
  },
  {
    id: 'axis_large_mid',
    name: 'Axis Large & Mid Cap Fund',
    category: 'Equity: Large & Mid Cap',
    code: 'AXIS',
    bgColor: '#9D174D',
    last5Y: '11.54% p.a',
    minInvest: '₹250',
    fundSize: '₹16,801.64Cr',
  },
];

export function ChotiSipScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedPill, setSelectedPill] = useState('Affordable');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleFundPress = (fund: FundItem) => {
    Alert.alert(
      fund.name,
      `Choti SIP Plan (Just ${fund.minInvest}/month)\nCategory: ${fund.category}\n5Y Annual Return: ${fund.last5Y}\nFund Size: ${fund.fundSize}\n\nAutomate a small investment of ₹250 every month with auto-debit on your preferred date.`,
      [
        { text: `Start ₹250 SIP`, style: 'default' },
        { text: 'Custom Amount', style: 'default' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExploreAll = () => {
    Alert.alert(
      'Explore All Mutual Funds',
      'Discover 500+ micro-investment eligible funds starting @ ₹100 - ₹250/month with SmartWallet 0% brokerage.',
      [{ text: 'Explore Collections', style: 'default' }]
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

        <Text style={styles.headerTitle}>Choti SIP with ₹250</Text>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => Alert.alert('Share', 'Share Choti SIP ₹250 with friends!')}
            activeOpacity={0.7}
          >
            <ShareIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              Alert.alert(
                'Choti SIP Help',
                'Choti SIP lets you start investing in top mutual funds with as little as ₹250 per month, making wealth creation accessible for everyone.'
              )
            }
            activeOpacity={0.7}
          >
            <QuestionHelpIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== HERO CARD ==================== */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroSubtitle}>CHOTI SIP WITH ₹250</Text>
            <Text style={styles.heroTitle}>Begin your wealth journey today</Text>
            <Text style={styles.heroDesc}>
              Build a healthy wealth-creation habit by starting your investment journey with as little as ₹250.
            </Text>
          </View>

          <View style={styles.heroGraphicCol}>
            <CoinStackMedalGraphic />
          </View>
        </View>

        {/* ==================== BENEFIT PILLS ==================== */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {[
            { id: 'Ideal for 3+ years', emoji: '📅', label: 'Ideal for 3+ years' },
            { id: 'Affordable', emoji: '🤝', label: 'Affordable' },
            { id: 'Long Term', emoji: '📈', label: 'Long Term' },
            { id: 'No Lock-in', emoji: '🔒', label: 'No Lock-in' },
          ].map((pill) => {
            const isSelected = selectedPill === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                style={[styles.pillBadge, isSelected && styles.pillBadgeActive]}
                onPress={() => setSelectedPill(pill.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.pillEmoji}>{pill.emoji}</Text>
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ==================== FUND CARDS ==================== */}
        <View style={styles.fundsList}>
          {CHOTI_SIP_FUNDS.map((fund) => (
            <TouchableOpacity
              key={fund.id}
              style={styles.fundCard}
              onPress={() => handleFundPress(fund)}
              activeOpacity={0.8}
            >
              {/* Header: Logo, Name, Category, Arrow */}
              <View style={styles.fundCardHeader}>
                <FundLogoBadge code={fund.code} bg={fund.bgColor} />
                <View style={styles.fundMeta}>
                  <Text style={styles.fundName} numberOfLines={1}>
                    {fund.name}
                  </Text>
                  <Text style={styles.fundCategory}>{fund.category}</Text>
                </View>
                <ChevronRightIcon color="#94A3B8" />
              </View>

              {/* Stats Row */}
              <View style={styles.fundStatsRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Last 5Y</Text>
                  <Text style={styles.statReturn}>{fund.last5Y}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Min Invest.</Text>
                  <Text style={styles.statValue}>{fund.minInvest}</Text>
                </View>

                <View style={styles.statColRight}>
                  <Text style={styles.statLabel}>Fund Size</Text>
                  <Text style={styles.statValue}>{fund.fundSize}</Text>
                </View>
              </View>

              {/* Action Link */}
              <TouchableOpacity
                style={styles.moreDetailsBtn}
                onPress={() => handleFundPress(fund)}
                activeOpacity={0.7}
              >
                <Text style={styles.moreDetailsText}>More Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* ==================== EXPLORE ALL FUNDS ==================== */}
        <TouchableOpacity
          style={styles.exploreAllCard}
          onPress={handleExploreAll}
          activeOpacity={0.8}
        >
          <View style={styles.exploreIconWrapper}>
            <GridExploreIcon />
          </View>
          <View style={styles.exploreTextCol}>
            <Text style={styles.exploreTitle}>Explore all mutual funds</Text>
            <Text style={styles.exploreSubtitle}>Funds in Focus, collections & more</Text>
          </View>
          <ChevronRightIcon color="#94A3B8" />
        </TouchableOpacity>

        {/* ==================== LEGAL FOOTER ==================== */}
        <View style={styles.legalFooter}>
          <Text style={styles.legalHeader}>
            SmartWallet Wealth Broking Private Limited
          </Text>
          <Text style={styles.legalSub}>
            AMFI-registered Mutual Fund Distributor ARN-187821
          </Text>
          <Text style={styles.legalRisk}>
            Investments in the securities market are subject to market risks, read all the related documents carefully before investing.{' '}
            <Text
              style={styles.legalLink}
              onPress={() => Alert.alert('T&C', 'SmartWallet Mutual Funds Terms & Conditions')}
            >
              T&C apply
            </Text>
          </Text>
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
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  heroGraphicCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pills
  pillsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBadgeActive: {
    backgroundColor: '#ECFDF5',
    borderColor: Colors.forestGreen,
  },
  pillEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.forestGreen,
    fontWeight: '700',
  },

  // Funds List
  fundsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  fundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  fundCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundLogoContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fundLogoText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fundMeta: {
    flex: 1,
    paddingRight: 8,
  },
  fundName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  fundCategory: {
    fontSize: 11,
    color: '#64748B',
  },

  // Stats Row
  fundStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statCol: {
    flex: 1,
  },
  statColRight: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statReturn: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // More details
  moreDetailsBtn: {
    marginTop: 12,
    paddingTop: 6,
  },
  moreDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // Explore All Card
  exploreAllCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
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
  exploreIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  exploreTextCol: {
    flex: 1,
  },
  exploreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  exploreSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  // Legal
  legalFooter: {
    marginTop: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  legalHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
    textAlign: 'center',
  },
  legalSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
    textAlign: 'center',
  },
  legalRisk: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 15,
    textAlign: 'center',
  },
  legalLink: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});

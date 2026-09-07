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

function SipCalendarGraphic() {
  return (
    <Svg width={110} height={85} viewBox="0 0 110 85" fill="none">
      <Defs>
        <LinearGradient id="calGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
        <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>

      {/* Calendar Backing */}
      <Rect x="20" y="10" width="65" height="60" rx="10" fill="url(#calGrad)" />
      <Rect x="20" y="10" width="65" height="18" rx="6" fill="#1E40AF" />
      <Circle cx="35" cy="19" r="2.5" fill="#FFFFFF" />
      <Circle cx="70" cy="19" r="2.5" fill="#FFFFFF" />

      {/* Calendar Grid Lines */}
      <Rect x="30" y="36" width="8" height="6" rx="2" fill="#93C5FD" />
      <Rect x="44" y="36" width="8" height="6" rx="2" fill="#93C5FD" />
      <Rect x="58" y="36" width="8" height="6" rx="2" fill="#93C5FD" />
      <Rect x="30" y="48" width="8" height="6" rx="2" fill="#93C5FD" />
      <Rect x="44" y="48" width="8" height="6" rx="2" fill="#93C5FD" />
      <Rect x="58" y="48" width="8" height="6" rx="2" fill="#93C5FD" />

      {/* Big Shining Gold Coin */}
      <Circle cx="78" cy="55" r="18" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
      <Circle cx="78" cy="55" r="14" fill="#F59E0B" opacity={0.6} />
      <SvgText
        x="78"
        y="61"
        fontSize="16"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        ₹
      </SvgText>

      {/* Sparkles */}
      <Circle cx="12" cy="40" r="1.5" fill="#FDE047" />
      <Circle cx="96" cy="22" r="2" fill="#FDE047" />
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

function ShortlistFilterIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6H20M7 12H17M9 18H15" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
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

// Fund Logo Placeholder SVGs
function FundLogoBadge({ code, bg }: { code: string; bg: string }) {
  return (
    <View style={[styles.fundLogoContainer, { backgroundColor: bg }]}>
      <Text style={styles.fundLogoText}>{code}</Text>
    </View>
  );
}

// ==========================================
// FUND DATA
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

const BEST_SIP_FUNDS: FundItem[] = [
  {
    id: 'icici_large_mid',
    name: 'ICICI Prudential Large & Mid Cap Fund',
    category: 'Equity: Large & Mid Cap',
    code: 'ICICI',
    bgColor: '#C2410C',
    last5Y: '16.1% p.a',
    minInvest: '₹100',
    fundSize: '₹32,706.25Cr',
  },
  {
    id: 'sbi_contra',
    name: 'SBI Contra Fund',
    category: 'Equity: Contra',
    code: 'SBI',
    bgColor: '#0284C7',
    last5Y: '15.01% p.a',
    minInvest: '₹500',
    fundSize: '₹48,266.35Cr',
  },
  {
    id: 'hdfc_flexi',
    name: 'HDFC Flexi Cap Fund',
    category: 'Equity: Flexi Cap',
    code: 'HDFC',
    bgColor: '#DC2626',
    last5Y: '17.08% p.a',
    minInvest: '₹100',
    fundSize: '₹1,10,736.41Cr',
  },
  {
    id: 'bandhan_large_mid',
    name: 'Bandhan Large & Mid Cap Fund',
    category: 'Equity: Large & Mid Cap',
    code: 'BNDN',
    bgColor: '#EA580C',
    last5Y: '15.82% p.a',
    minInvest: '₹100',
    fundSize: '₹19,777.42Cr',
  },
];

export function BestSipFundsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedPill, setSelectedPill] = useState('High Growth');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleFundPress = (fund: FundItem) => {
    Alert.alert(
      fund.name,
      `Category: ${fund.category}\n5-Year Return: ${fund.last5Y}\nMin SIP: ${fund.minInvest}\nTotal AUM: ${fund.fundSize}\n\nStart your automated monthly SIP with 0% commission & zero paperwork.`,
      [
        { text: 'Start Monthly SIP', style: 'default' },
        { text: 'One-Time Lumpsum', style: 'default' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExploreAll = () => {
    Alert.alert(
      'Explore All Mutual Funds',
      'Browsing 2,500+ direct mutual funds across Equity, Debt, Hybrid, Index, and ELSS Tax Saving funds with SmartWallet CRISP ratings.',
      [{ text: 'View Funds', style: 'default' }]
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

        <Text style={styles.headerTitle}>Best SIP Funds</Text>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => Alert.alert('Share', 'Share Best SIP Funds with your friends and family.')}
            activeOpacity={0.7}
          >
            <ShareIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              Alert.alert(
                'Best SIP Funds Help',
                'SIP (Systematic Investment Plan) allows you to invest fixed amounts regularly to benefit from rupee-cost averaging and long-term compounding.'
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
            <Text style={styles.heroSubtitle}>BEST SIP FUNDS</Text>
            <Text style={styles.heroTitle}>Invest in Funds with strong SIP Performance</Text>
            <Text style={styles.heroDesc}>
              Grow your money with Best SIP Funds. Ideal for long term investment.
            </Text>
          </View>

          <View style={styles.heroGraphicCol}>
            <SipCalendarGraphic />
          </View>
        </View>

        {/* ==================== BENEFIT PILLS ==================== */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {[
            { id: 'High Growth', emoji: '📊', label: 'High Growth' },
            { id: 'No Lock-in', emoji: '🔒', label: 'No Lock-in' },
            { id: 'Ideal for 3+ years', emoji: '📅', label: 'Ideal for 3+ years' },
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

        {/* ==================== SHORTLISTED HEADER ==================== */}
        <View style={styles.shortlistBanner}>
          <View style={styles.shortlistIconBg}>
            <ShortlistFilterIcon />
          </View>
          <View style={styles.shortlistTextCol}>
            <Text style={styles.shortlistTitle}>Shortlisted Funds</Text>
            <Text style={styles.shortlistSubtitle}>
              Based on CRISP and other factors.{' '}
              <Text
                style={styles.learnMoreLink}
                onPress={() => Alert.alert('CRISP Scoring', 'SmartWallet CRISP score ranks funds based on Consistency, Returns, Inflows, Safety, and Portfolio quality.')}
              >
                Learn more
              </Text>
            </Text>
          </View>
        </View>

        {/* ==================== FUND CARDS ==================== */}
        <View style={styles.fundsList}>
          {BEST_SIP_FUNDS.map((fund) => (
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
    paddingVertical: 12,
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

  // Shortlisted Banner
  shortlistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  shortlistIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  shortlistTextCol: {
    flex: 1,
  },
  shortlistTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B21A8',
  },
  shortlistSubtitle: {
    fontSize: 11,
    color: '#7E22CE',
    marginTop: 1,
  },
  learnMoreLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
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
    fontSize: 10,
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

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Animated,
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
import {
  ApproveToPayIcon,
  BestSipFundsIcon,
  BikeInsuranceIcon,
  BuyGoldIcon,
  BuySilverIcon,
  CarInsuranceIcon,
  ChotiSipIcon,
  CreditScoreIcon,
  DailyGoldIcon,
  DailySilverIcon,
  DailySipIcon,
  ElectricityBillIcon,
  FastagRechargeIcon,
  GoldLoanIcon,
  HealthInsuranceIcon,
  HighGrowthFundsIcon,
  LifeInsuranceIcon,
  LoanRepaymentIcon,
  MobileRechargeIcon,
  MutualFundsLoanIcon,
  PersonalLoanIcon,
  QrScannerHeaderIcon,
  QuestionHelpIcon,
  SearchHeaderIcon,
  ToBankIcon,
  ToMobileIcon,
  UpiCircleIcon,
} from '../components/pay/PayIcons';
import { QrScannerModal } from '../components/pay/QrScannerModal';
import { UpiFaqModal } from '../components/pay/UpiFaqModal';
import { CopyIcon, EyeIcon, EyeOffIcon } from '../components/icons/TabIcon';
import { SWLogo } from '../components/icons/SWLogo';
import { Colors } from '../theme/colors';

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
};

export function PayScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpiHidden, setIsUpiHidden] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleCopyUpi = () => {
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleServicePress = (item: ServiceItem) => {
    if (item.id === 'to_mobile') {
      navigation.navigate('SendMoney');
      return;
    }
    if (item.id === 'to_bank') {
      navigation.navigate('TransferMethod');
      return;
    }
    if (item.id === 'approve_pay') {
      navigation.navigate('ApproveToPay');
      return;
    }
    if (item.id === 'mob_recharge') {
      navigation.navigate('MobileRecharge');
      return;
    }
    if (item.id === 'fastag') {
      navigation.navigate('FastagRecharge');
      return;
    }
    if (item.id === 'electricity') {
      navigation.navigate('ElectricityBill');
      return;
    }
    if (item.id === 'loan_repay') {
      navigation.navigate('LoanRepayment');
      return;
    }
    if (item.id === 'personal_loan') {
      navigation.navigate('PersonalLoan');
      return;
    }
    if (item.id === 'mf_loan') {
      navigation.navigate('MutualFundsLoan');
      return;
    }
    if (item.id === 'gold_loan') {
      navigation.navigate('GoldLoan');
      return;
    }
    if (item.id === 'credit_score') {
      navigation.navigate('CreditScore');
      return;
    }
    if (item.id === 'daily_gold') {
      navigation.navigate('DailyGold');
      return;
    }
    if (item.id === 'buy_gold') {
      navigation.navigate('BuyGold');
      return;
    }
    if (item.id === 'daily_silver') {
      navigation.navigate('DailySilver');
      return;
    }
    if (item.id === 'buy_silver') {
      navigation.navigate('BuySilver');
      return;
    }
    if (item.id === 'bike_ins') {
      navigation.navigate('BikeInsurance');
      return;
    }
    if (item.id === 'car_ins') {
      navigation.navigate('CarInsurance');
      return;
    }
    if (item.id === 'health_ins') {
      navigation.navigate('HealthInsurance');
      return;
    }
    if (item.id === 'life_ins') {
      navigation.navigate('LifeInsurance');
      return;
    }
    if (item.id === 'best_sip') {
      navigation.navigate('BestSipFunds');
      return;
    }
    if (item.id === 'choti_sip') {
      navigation.navigate('ChotiSip');
      return;
    }
    if (item.id === 'high_growth') {
      navigation.navigate('HighGrowthFunds');
      return;
    }
    if (item.id === 'daily_sip') {
      navigation.navigate('DailySip');
      return;
    }

    Alert.alert(
      item.title.replace(/\n/g, ' '),
      `Opening ${item.title.replace(/\n/g, ' ')} under ${item.category}...`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  // ==========================================
  // ALL 24 PAYMENT SERVICES IN 6 SECTIONS
  // ==========================================

  const SECTIONS_DATA = useMemo(() => [
    {
      id: 'payments',
      title: 'Payment & Transfers',
      hasUpiHandle: true,
      items: [
        { id: 'to_mobile', title: 'To\nmobile', category: 'Payment & Transfers', icon: <ToMobileIcon size={30} /> },
        { id: 'to_bank', title: 'To bank/\nUPI/Self', category: 'Payment & Transfers', icon: <ToBankIcon size={30} /> },
        { id: 'approve_pay', title: 'Approve\nto Pay', category: 'Payment & Transfers', icon: <ApproveToPayIcon size={30} /> },
        {
          id: 'upi_circle',
          title: 'UPI\nCircle',
          category: 'Payment & Transfers',
          icon: <UpiCircleIcon size={30} />,
          badge: 'UPI CIRCLE',
          badgeColor: Colors.forestGreen,
        },
      ],
    },
    {
      id: 'recharge_bills',
      title: 'Recharge & Bills',
      items: [
        { id: 'mob_recharge', title: 'Mobile\nRecharge', category: 'Recharge & Bills', icon: <MobileRechargeIcon size={30} /> },
        { id: 'fastag', title: 'Fastag\nRecharge', category: 'Recharge & Bills', icon: <FastagRechargeIcon size={30} /> },
        { id: 'electricity', title: 'Electricity\nBill', category: 'Recharge & Bills', icon: <ElectricityBillIcon size={30} /> },
        { id: 'loan_repay', title: 'Loan\nRepayment', category: 'Recharge & Bills', icon: <LoanRepaymentIcon size={30} /> },
      ],
    },
    {
      id: 'loans',
      title: 'Loans',
      items: [
        { id: 'personal_loan', title: 'Personal\nLoan', category: 'Loans', icon: <PersonalLoanIcon size={30} /> },
        { id: 'mf_loan', title: 'Mutual\nFunds Loan', category: 'Loans', icon: <MutualFundsLoanIcon size={30} /> },
        { id: 'gold_loan', title: 'Gold\nLoan', category: 'Loans', icon: <GoldLoanIcon size={30} /> },
        {
          id: 'credit_score',
          title: 'Credit\nScore',
          category: 'Loans',
          icon: <CreditScoreIcon size={30} />,
          badge: 'FREE',
          badgeColor: Colors.warning,
        },
      ],
    },
    {
      id: 'gold_silver',
      title: 'Gold, Silver & Platinum',
      items: [
        { id: 'daily_gold', title: 'Daily Gold\nwith ₹10', category: 'Gold, Silver & Platinum', icon: <DailyGoldIcon size={30} /> },
        { id: 'buy_gold', title: 'Buy\nGold', category: 'Gold, Silver & Platinum', icon: <BuyGoldIcon size={30} /> },
        { id: 'daily_silver', title: 'Daily Silver\nwith ₹10', category: 'Gold, Silver & Platinum', icon: <DailySilverIcon size={30} /> },
        { id: 'buy_silver', title: 'Buy\nSilver', category: 'Gold, Silver & Platinum', icon: <BuySilverIcon size={30} /> },
      ],
    },
    {
      id: 'insurance',
      title: 'Insurance',
      items: [
        { id: 'bike_ins', title: 'Bike', category: 'Insurance', icon: <BikeInsuranceIcon size={30} /> },
        { id: 'car_ins', title: 'Car', category: 'Insurance', icon: <CarInsuranceIcon size={30} /> },
        { id: 'health_ins', title: 'Health', category: 'Insurance', icon: <HealthInsuranceIcon size={30} /> },
        { id: 'life_ins', title: 'Life', category: 'Insurance', icon: <LifeInsuranceIcon size={30} /> },
      ],
    },
    {
      id: 'mutual_funds',
      title: 'Mutual Funds',
      items: [
        { id: 'best_sip', title: 'Best SIP\nFunds', category: 'Mutual Funds', icon: <BestSipFundsIcon size={30} /> },
        { id: 'choti_sip', title: 'Choti SIP\nwith ₹250', category: 'Mutual Funds', icon: <ChotiSipIcon size={30} /> },
        { id: 'high_growth', title: 'High Growth\nFunds', category: 'Mutual Funds', icon: <HighGrowthFundsIcon size={30} /> },
        { id: 'daily_sip', title: 'Daily SIP\nwith ₹10', category: 'Mutual Funds', icon: <DailySipIcon size={30} /> },
      ],
    },
  ], []);

  // Flat list of all 24 items for real-time search
  const allServices: ServiceItem[] = useMemo(() => {
    return SECTIONS_DATA.flatMap((sec) => sec.items);
  }, [SECTIONS_DATA]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allServices.filter(
      (item) =>
        item.title.replace(/\n/g, ' ').toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allServices]);

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* ==================== TOP ACTION HEADER ==================== */}
      <View style={styles.topHeader}>
        {/* Leftmost: QR Code Scanner Button */}
        <TouchableOpacity
          style={styles.qrScannerBtn}
          onPress={() => setIsScannerOpen(true)}
          activeOpacity={0.8}
          accessibilityLabel="Open QR Scanner"
        >
          <QrScannerHeaderIcon size={42} />
        </TouchableOpacity>

        {/* Center: Branding Title */}
        <View style={styles.centerBrandRow}>
          <Text style={styles.screenTitle}>Payments</Text>
          <SWLogo size={16} />
        </View>

        {/* Right side: Search and FAQ Help Icons */}
        <View style={styles.rightActionsRow}>
          <TouchableOpacity
            style={[styles.actionIconBtn, isSearchActive && styles.actionIconBtnActive]}
            onPress={() => {
              setIsSearchActive(!isSearchActive);
              if (isSearchActive) setSearchQuery('');
            }}
            activeOpacity={0.7}
            accessibilityLabel="Search services"
          >
            <SearchHeaderIcon size={20} color={isSearchActive ? Colors.forestGreen : Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => setIsFaqOpen(true)}
            activeOpacity={0.7}
            accessibilityLabel="UPI FAQs"
          >
            <QuestionHelpIcon size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================== IN-PAGE SEARCH BAR (When active) ==================== */}
      {isSearchActive && (
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarBox}>
            <SearchHeaderIcon size={18} color={Colors.forestGreen} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search all 24 bills, transfers, SIPs, loans..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* ==================== MAIN CONTENT SCROLLVIEW ==================== */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH RESULTS VIEW (if searching) */}
        {isSearchActive && searchQuery.trim().length > 0 ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsHeading}>
              Found {searchResults.length} {searchResults.length === 1 ? 'service' : 'services'}
            </Text>

            {searchResults.length === 0 ? (
              <View style={styles.emptySearchBox}>
                <Text style={styles.emptySearchText}>No matching services found</Text>
                <Text style={styles.emptySearchSubtext}>Try searching for "recharge", "gold", "sip", "loan", or "car"</Text>
              </View>
            ) : (
              <View style={styles.searchResultsGrid}>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchResultCard}
                    onPress={() => handleServicePress(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      {item.icon}
                    </View>
                    <View style={styles.searchResultTextCol}>
                      <Text style={styles.searchResultTitle}>{item.title.replace(/\n/g, ' ')}</Text>
                      <Text style={styles.searchResultCategory}>{item.category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          /* ==================== 6 SECTIONS (4 ICONS EACH) ==================== */
          SECTIONS_DATA.map((section) => (
            <View key={section.id} style={styles.sectionCard}>
              {/* Section Header Row */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{section.title}</Text>

                {/* Top UPI ID Handle Display (on Payment & Transfers) */}
                {section.hasUpiHandle && (
                  <View style={styles.upiHandleWrapper}>
                    <TouchableOpacity
                      onPress={() => setIsUpiHidden(!isUpiHidden)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      {isUpiHidden ? (
                        <EyeOffIcon size={13} color={Colors.forestGreen} />
                      ) : (
                        <EyeIcon size={13} color={Colors.forestGreen} />
                      )}
                    </TouchableOpacity>

                    <Text style={styles.upiHandleText}>
                      {isUpiHidden ? '******@upi' : '******9077@upi'}
                    </Text>

                    <TouchableOpacity
                      onPress={handleCopyUpi}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <CopyIcon size={13} color={copiedUpi ? Colors.forestGreenDark : Colors.forestGreen} />
                    </TouchableOpacity>

                    {copiedUpi && (
                      <View style={styles.copiedBadge}>
                        <Text style={styles.copiedText}>Copied!</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* 4-Item Horizontal Grid */}
              <View style={styles.itemsGrid}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridItem}
                    onPress={() => handleServicePress(item)}
                    activeOpacity={0.75}
                  >
                    {/* Floating Top Badge (e.g. UPI CIRCLE / FREE) */}
                    {item.badge && (
                      <View
                        style={[
                          styles.itemBadge,
                          { backgroundColor: item.badgeColor || Colors.forestGreen },
                        ]}
                      >
                        <Text style={styles.itemBadgeText}>{item.badge}</Text>
                      </View>
                    )}

                    {/* Circular Icon Container */}
                    <View style={styles.iconCircle}>
                      {item.icon}
                    </View>

                    {/* 2-Line Centered Label */}
                    <Text style={styles.itemLabel} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ==================== MODALS ==================== */}
      <QrScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <UpiFaqModal
        visible={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background, // Crisp white
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  qrScannerBtn: {
    borderRadius: 14,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  centerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBtnActive: {
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreenBorder,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 13.5,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 110, // Margin to keep clear of floating pill tab bar
    gap: 14,
  },
  sectionCard: {
    backgroundColor: Colors.surfaceSubtle, // Flat, borderless, light-gray block
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  upiHandleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  upiHandleText: {
    fontSize: 11,
    color: Colors.forestGreenDark,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  copiedBadge: {
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  copiedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  itemsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  itemBadge: {
    position: 'absolute',
    top: -8,
    right: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  itemBadgeText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  itemLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15.5,
  },
  searchResultsContainer: {
    paddingTop: 4,
    gap: 12,
  },
  searchResultsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  searchResultsGrid: {
    gap: 10,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surfaceSubtle,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchResultTextCol: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchResultCategory: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.forestGreen,
    marginTop: 2,
  },
  emptySearchBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearchText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySearchSubtext: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

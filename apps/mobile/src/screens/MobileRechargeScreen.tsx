import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
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
import { QuestionHelpIcon, SearchHeaderIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Telecom Operator Logos
function OperatorLogo({ operator, size = 38 }: { operator: 'airtel' | 'jio' | 'vi' | 'bsnl'; size?: number }) {
  if (operator === 'airtel') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#EF4444" />
        <Path d="M12 28C12 20 18 12 28 12C28 17 25 24 18 26L12 28Z" fill="#FFFFFF" />
        <Circle cx="26" cy="24" r="3.5" fill="#FFFFFF" />
      </Svg>
    );
  }
  if (operator === 'jio') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#0284C7" />
        <Circle cx="20" cy="20" r="14" fill="#0369A1" />
        <SvgText x="20" y="24" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">Jio</SvgText>
      </Svg>
    );
  }
  if (operator === 'bsnl') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <Circle cx="20" cy="20" r="12" fill="#0284C7" />
        <Path d="M14 20L20 12L26 20H14Z" fill="#EF4444" />
        <Path d="M14 20L20 28L26 20H14Z" fill="#3B82F6" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="10" fill="#F59E0B" />
      <SvgText x="20" y="25" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">Vi</SvgText>
    </Svg>
  );
}

type RecentRecharge = {
  id: string;
  name: string;
  phone: string;
  operator: 'airtel' | 'jio' | 'vi' | 'bsnl';
  lastRecharge: string;
  lastAmount: string;
};

type QuickTopup = {
  id: string;
  recipient: string;
  operator: 'airtel' | 'jio' | 'bsnl';
  plan: string;
  price: string;
};

type ContactItem = {
  id: string;
  name: string;
  phone: string;
  avatarBg: string;
  initials: string;
};

const QUICK_TOPUPS: QuickTopup[] = [
  { id: 'q1', recipient: 'Mamma', operator: 'jio', plan: '1 GB', price: '₹19' },
  { id: 'q2', recipient: 'Me', operator: 'jio', plan: '1 GB', price: '₹19' },
  { id: 'q3', recipient: 'Thakur BSNL', operator: 'bsnl', plan: '2 GB', price: '₹16' },
];

const RECENTS_RECHARGES: RecentRecharge[] = [
  {
    id: 'r1',
    name: 'Papa',
    phone: '9116432430',
    operator: 'airtel',
    lastRecharge: '19 Jul 2026',
    lastAmount: '₹579',
  },
  {
    id: 'r2',
    name: 'Badi Mamma',
    phone: '6378703930',
    operator: 'jio',
    lastRecharge: '15 Jul 2026',
    lastAmount: '₹239',
  },
  {
    id: 'r3',
    name: 'Me',
    phone: '6377739077',
    operator: 'jio',
    lastRecharge: '22 Jun 2026',
    lastAmount: '₹899',
  },
  {
    id: 'r4',
    name: 'Thakur BSNL',
    phone: '7597025909',
    operator: 'bsnl',
    lastRecharge: '17 Jun 2026',
    lastAmount: '₹153',
  },
];

const CONTACTS_LIST: ContactItem[] = [
  { id: 'c1', name: 'My Number', phone: '6377739077', avatarBg: '#D97706', initials: 'MN' },
  { id: 'c2', name: '+91 94140 58949', phone: '9414058949', avatarBg: '#3B82F6', initials: '+5' },
  { id: 'c3', name: '77340 79133', phone: '7734079133', avatarBg: '#64748B', initials: '77' },
  { id: 'c4', name: 'A En RSEB Tjr', phone: '9413390513', avatarBg: '#DB2777', initials: 'AT' },
];

export function MobileRechargeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleSelectRecharge = (name: string, phone: string) => {
    Alert.alert(
      `Recharge for ${name}`,
      `Mobile: +91 ${phone}\nSelect a plan to proceed with Instant Recharge.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Browse Plans',
          style: 'default',
          onPress: () => {
            Alert.alert('Plans Loaded', 'Displaying Unlimited 5G, Data Add-ons, and OTT bundles...');
          },
        },
      ]
    );
  };

  const filteredRecents = useMemo(() => {
    if (!searchQuery.trim()) return RECENTS_RECHARGES;
    const q = searchQuery.toLowerCase().trim();
    return RECENTS_RECHARGES.filter(
      (r) => r.name.toLowerCase().includes(q) || r.phone.includes(q)
    );
  }, [searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return CONTACTS_LIST;
    const q = searchQuery.toLowerCase().trim();
    return CONTACTS_LIST.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [searchQuery]);

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* ==================== TOP HEADER ==================== */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mobile Recharge</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Mobile Recharge Help', 'Recharge prepaid numbers across Jio, Airtel, Vi, and BSNL with zero platform fee & instant activation.');
          }}
          activeOpacity={0.7}
        >
          <QuestionHelpIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ==================== SEARCH BAR ==================== */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <SearchHeaderIcon size={18} color={Colors.forestGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Number or Name"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="default"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== QUICK DATA TOP-UP ==================== */}
        {!searchQuery && (
          <View style={styles.topupSection}>
            <Text style={styles.sectionLabel}>Quick Data Top-up</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topupScroll}>
              {QUICK_TOPUPS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.topupCard}
                  onPress={() => handleSelectRecharge(item.recipient, 'Linked Number')}
                  activeOpacity={0.8}
                >
                  <OperatorLogo operator={item.operator} size={30} />
                  <View style={styles.topupInfo}>
                    <Text style={styles.topupRecipient} numberOfLines={1}>{item.recipient}</Text>
                    <Text style={styles.topupPlan}>{item.plan} for {item.price}</Text>
                  </View>
                  <View style={styles.topupArrowBtn}>
                    <Text style={styles.topupArrowText}>➔</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================== RECENTS LIST ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>RECENTS</Text>
        </View>

        <View style={styles.cardList}>
          {filteredRecents.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.rechargeRow}
              onPress={() => handleSelectRecharge(item.name, item.phone)}
              activeOpacity={0.75}
            >
              <OperatorLogo operator={item.operator} size={42} />

              <View style={styles.rechargeDetails}>
                <Text style={styles.rechargeName}>{item.name}</Text>
                <Text style={styles.rechargePhone}>{item.phone}</Text>
                <Text style={styles.rechargeMeta}>
                  Last Recharge: {item.lastAmount} on {item.lastRecharge}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.dotsMenuBtn}
                onPress={() => Alert.alert(item.name, `Manage ${item.phone} preferences`)}
              >
                <Text style={styles.dotsText}>⋮</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* ==================== ALL CONTACTS ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>ALL CONTACTS</Text>
        </View>

        <View style={styles.cardList}>
          {filteredContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.rechargeRow}
              onPress={() => handleSelectRecharge(contact.name, contact.phone)}
              activeOpacity={0.75}
            >
              <View style={[styles.contactAvatar, { backgroundColor: contact.avatarBg }]}>
                <Text style={styles.avatarInitials}>{contact.initials}</Text>
              </View>

              <View style={styles.rechargeDetails}>
                <Text style={styles.rechargeName}>{contact.name}</Text>
                <Text style={styles.rechargePhone}>{contact.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer Footer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            By proceeding further, you allow SmartWallet to fetch your current and future plan expiry information and remind you on time.
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBox: {
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
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topupSection: {
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  topupScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  topupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    minWidth: 160,
  },
  topupInfo: {
    flex: 1,
  },
  topupRecipient: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  topupPlan: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  topupArrowBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topupArrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  cardList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  rechargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  rechargeDetails: {
    flex: 1,
  },
  rechargeName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rechargePhone: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rechargeMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  dotsMenuBtn: {
    padding: 8,
  },
  dotsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  disclaimerBox: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

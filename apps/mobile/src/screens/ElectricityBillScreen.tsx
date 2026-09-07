import React, { useMemo, useState } from 'react';
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
import { QuestionHelpIcon, SearchHeaderIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Electricity Provider SVG Logo
function PowerProviderLogo({ name, color = '#0284C7', size = 38 }: { name: string; color?: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="10" fill={color} />
      <Path d="M21 9L15 21H21L19 31L27 19H21L21 9Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    </Svg>
  );
}

type LinkedAccount = {
  id: string;
  name: string;
  consumerId: string;
  lastPaidInfo: string;
  provider: string;
};

type ElectricityProvider = {
  id: string;
  name: string;
  state?: string;
  isNew?: boolean;
  color?: string;
};

const MOCK_LINKED_ACCOUNT: LinkedAccount = {
  id: 'la1',
  name: 'NARAYAN DAS MUTREJJA',
  consumerId: '211644037129',
  lastPaidInfo: '₹2,940 paid on 15 Jul 2026',
  provider: 'Punjab State Power Corporation Ltd (PSPCL)',
};

const REGIONAL_PROVIDERS: ElectricityProvider[] = [
  { id: 'p1', name: 'Punjab State Power Corporation Ltd (PSPCL)', state: 'Punjab', color: '#0369A1' },
  { id: 'p2', name: 'SAI Computers Ltd', state: 'Punjab', isNew: true, color: '#475569' },
  { id: 'p3', name: 'The Co operative Electric Supply Society Ltd Sircilla', state: 'Punjab', color: '#047857' },
];

const ALL_PROVIDERS: ElectricityProvider[] = [
  { id: 'ap1', name: 'Assam Power Distribution Company Ltd (APDCL) - Prepaid Recharge', color: '#D97706' },
  { id: 'ap2', name: 'Assam Power Distribution Company Limited (APDCL) - Bill Payment', color: '#D97706' },
  { id: 'ap3', name: 'AEML SEEPZ Limited', isNew: true, color: '#DC2626' },
  { id: 'ap4', name: 'Adani Electricity Mumbai Limited (AEML)', color: '#DC2626' },
  { id: 'ap5', name: 'Ajmer Vidyut Vitran Nigam Ltd (AVVNL)', color: '#065F46' },
  { id: 'ap6', name: 'Bharatpur Electricity Services Ltd (BESL)', color: '#0284C7' },
  { id: 'ap7', name: 'BEST Mumbai - Brihanmumbai Electricity', color: '#DC2626' },
];

export function ElectricityBillScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handlePayAccount = (acc: LinkedAccount) => {
    Alert.alert(
      `Pay Bill: ${acc.name}`,
      `Consumer No: ${acc.consumerId}\nProvider: ${acc.provider}\nFetching latest billing amount from discom server...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fetch Bill',
          style: 'default',
          onPress: () => {
            Alert.alert('Bill Details', 'Current Cycle: No pending due. Next bill date: 15 Aug 2026.');
          },
        },
      ]
    );
  };

  const handleSelectProvider = (provider: ElectricityProvider) => {
    Alert.prompt
      ? Alert.prompt(
          provider.name,
          'Enter your Consumer / CA / K Number:',
          (text) => {
            if (text) {
              Alert.alert('Bill Found', `Consumer Number ${text} verified with ${provider.name}.`);
            }
          }
        )
      : Alert.alert(provider.name, 'Enter your Consumer / CA / K Number to view & pay bill.');
  };

  const filteredRegional = useMemo(() => {
    if (!searchQuery.trim()) return REGIONAL_PROVIDERS;
    const q = searchQuery.toLowerCase().trim();
    return REGIONAL_PROVIDERS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PROVIDERS;
    const q = searchQuery.toLowerCase().trim();
    return ALL_PROVIDERS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

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

        <Text style={styles.headerTitle}>Electricity</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Electricity Help', 'Pay state electricity & discom power bills across India with instant BBPS receipt.');
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
            placeholder="Search for electricity provider"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
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
        {/* ==================== YOUR ACCOUNTS ==================== */}
        {!searchQuery && (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionHeading}>Your Accounts</Text>
            <TouchableOpacity
              style={styles.accountCard}
              onPress={() => handlePayAccount(MOCK_LINKED_ACCOUNT)}
              activeOpacity={0.8}
            >
              <PowerProviderLogo name={MOCK_LINKED_ACCOUNT.name} color="#065F46" size={42} />

              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>{MOCK_LINKED_ACCOUNT.name}</Text>
                <Text style={styles.consumerNumber}>{MOCK_LINKED_ACCOUNT.consumerId}</Text>
                <Text style={styles.lastPaidText}>{MOCK_LINKED_ACCOUNT.lastPaidInfo}</Text>
              </View>

              <TouchableOpacity
                style={styles.dotsMenuBtn}
                onPress={() => Alert.alert(MOCK_LINKED_ACCOUNT.name, 'Manage linked electricity account')}
              >
                <Text style={styles.dotsText}>⋮</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================== REGIONAL PROVIDERS ==================== */}
        {filteredRegional.length > 0 && (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionHeading}>Providers in Punjab</Text>
            <View style={styles.providersList}>
              {filteredRegional.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.providerRow}
                  onPress={() => handleSelectProvider(p)}
                  activeOpacity={0.75}
                >
                  <PowerProviderLogo name={p.name} color={p.color} size={38} />
                  <Text style={styles.providerName}>{p.name}</Text>
                  {p.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>New</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ==================== ALL PROVIDERS ==================== */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeading}>All Providers</Text>
          <View style={styles.providersList}>
            {filteredAll.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.providerRow}
                onPress={() => handleSelectProvider(p)}
                activeOpacity={0.75}
              >
                <PowerProviderLogo name={p.name} color={p.color} size={38} />
                <Text style={styles.providerName}>{p.name}</Text>
                {p.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.bharatConnectFooter}>
          <Text style={styles.poweredByText}>Powered by </Text>
          <Text style={styles.bharatConnectBold}>Bharat Connect</Text>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  consumerNumber: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  lastPaidText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  dotsMenuBtn: {
    padding: 8,
  },
  dotsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  providersList: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  providerName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  newBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bharatConnectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  poweredByText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bharatConnectBold: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.forestGreenDark,
  },
});

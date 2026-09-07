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

// Loan Provider SVG Logo
function LoanProviderLogo({ name, color = '#1E3A8A', size = 38 }: { name: string; color?: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="10" fill={color} />
      <Circle cx="20" cy="20" r="13" fill="#FFFFFF" fillOpacity="0.15" />
      <SvgText x="20" y="25" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">{initial}</SvgText>
    </Svg>
  );
}

type LoanProvider = {
  id: string;
  name: string;
  category: 'all' | 'personal' | 'micro' | 'vehicle' | 'bank';
  isNew?: boolean;
  color?: string;
};

const LOAN_PROVIDERS: LoanProvider[] = [
  { id: 'l1', name: 'TVS Credit', category: 'vehicle', color: '#1E3A8A' },
  { id: 'l2', name: 'Annapurna Finance Private Limited-MFI', category: 'micro', color: '#047857' },
  { id: 'l3', name: 'Bajaj Finance LTD', category: 'personal', color: '#0284C7' },
  { id: 'l4', name: 'Bandhan Bank Loan', category: 'bank', isNew: true, color: '#DC2626' },
  { id: 'l5', name: 'Belstar Microfinance Limited', category: 'micro', color: '#0369A1' },
  { id: 'l6', name: 'HDFC Bank Retail Assets', category: 'bank', color: '#1E3A8A' },
  { id: 'l7', name: 'UJJIVAN Small Finance Bank Limited', category: 'bank', color: '#D97706' },
  { id: 'l8', name: 'Chaitanya Micro Finance', category: 'micro', color: '#0D9488' },
  { id: 'l9', name: 'DMI Finance', category: 'personal', color: '#334155' },
  { id: 'l10', name: 'HDB Financial Services Limited', category: 'personal', color: '#1E293B' },
  { id: 'l11', name: 'Home Credit', category: 'personal', color: '#EF4444' },
  { id: 'l12', name: 'IIFL Finance', category: 'personal', color: '#F59E0B' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'personal', label: 'Personal Loan' },
  { id: 'vehicle', label: 'Auto & Vehicle' },
  { id: 'micro', label: 'Microfinance' },
  { id: 'bank', label: 'Banking Assets' },
];

export function LoanRepaymentScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleSelectLoan = (provider: LoanProvider) => {
    Alert.prompt
      ? Alert.prompt(
          provider.name,
          'Enter your Loan Account Number (LAN):',
          (text) => {
            if (text) {
              Alert.alert('Loan EMI Fetched', `LAN ${text} verified with ${provider.name}. Instant EMI repayment ready.`);
            }
          }
        )
      : Alert.alert(provider.name, 'Enter your Loan Account Number (LAN) to fetch EMI.');
  };

  const filteredProviders = useMemo(() => {
    return LOAN_PROVIDERS.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

        <Text style={styles.headerTitle}>Loan Repayment</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Loan Repayment Help', 'Pay EMI dues for over 150+ NBFCs, microfinances, and banks instantly with BBPS verification.');
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
            placeholder="Search for loan provider"
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

      {/* ==================== CATEGORY FILTER CHIPS ==================== */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                selectedCategory === cat.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === cat.id && styles.filterChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>All Loan Providers</Text>
          <Text style={styles.countText}>{filteredProviders.length} lenders</Text>
        </View>

        <View style={styles.providersList}>
          {filteredProviders.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.providerRow}
              onPress={() => handleSelectLoan(p)}
              activeOpacity={0.75}
            >
              <LoanProviderLogo name={p.name} color={p.color} size={38} />
              <Text style={styles.providerName}>{p.name}</Text>
              {p.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  filterSection: {
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreenBorder,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.forestGreenDark,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countText: {
    fontSize: 11.5,
    color: Colors.textMuted,
    fontWeight: '600',
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

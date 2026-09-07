import React, { useMemo, useState } from 'react';
import {
  Platform,
  SectionList,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon, CloseIcon } from '../components/icons/BudgetIcons';
import { ChevronLeftIcon, FilterSlidersIcon, SearchIcon } from '../components/icons/TabIcon';
import { MOCK_ALL_TRANSACTIONS, TransactionItem } from '../data/mockTransactionsData';
import { Colors } from '../theme/colors';

type FilterType = 'all' | 'income' | 'outcome';

export function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter transactions by search query and type
  const filteredTransactions = useMemo(() => {
    return MOCK_ALL_TRANSACTIONS.filter((tx) => {
      // Type filter
      if (activeFilter === 'income' && tx.type !== 'income') return false;
      if (activeFilter === 'outcome' && tx.type !== 'outcome') return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        tx.title.toLowerCase().includes(query) ||
        tx.merchant.toLowerCase().includes(query) ||
        tx.categoryKey.toLowerCase().includes(query) ||
        tx.fullDate.toLowerCase().includes(query) ||
        tx.formattedAmount.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, activeFilter]);

  // Group filtered transactions into sections by date
  const sections = useMemo(() => {
    const map = new Map<string, TransactionItem[]>();

    filteredTransactions.forEach((tx) => {
      // Grouping keys
      let sectionKey = 'TODAY';
      if (tx.id === 'tx-4' || tx.id === 'tx-5' || tx.id === 'tx-6' || tx.id === 'tx-7') {
        sectionKey = 'TUESDAY, OCT 24';
      } else if (tx.id === 'tx-8' || tx.id === 'tx-9' || tx.id === 'tx-10') {
        sectionKey = 'FRIDAY, OCT 20';
      }

      if (!map.has(sectionKey)) {
        map.set(sectionKey, []);
      }
      map.get(sectionKey)!.push(tx);
    });

    return Array.from(map.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  }, [filteredTransactions]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'outcome', label: 'Outcome' },
  ];

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction History</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CloseIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs & Sliders */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.sliderBtn}
          activeOpacity={0.7}
        >
          <FilterSlidersIcon size={18} color={Colors.textPrimary} />
        </TouchableOpacity>

        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Grouped SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
            <View style={styles.sectionDivider} />
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isIncome = item.type === 'income';
          const isLast = index === section.data.length - 1;

          return (
            <View style={[styles.txItem, !isLast && styles.txBorder]}>
              {/* Category Icon */}
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <CategoryIcon
                  categoryKey={item.categoryKey}
                  size={18}
                  color={item.iconColor}
                />
              </View>

              {/* Title & Subtitle */}
              <View style={styles.txDetails}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.txSubtitle}>{item.fullDate}</Text>
              </View>

              {/* Amount & Type */}
              <View style={styles.amountCol}>
                <Text
                  style={[
                    styles.txAmount,
                    isIncome ? styles.amountIncome : styles.amountOutcome,
                  ]}
                >
                  {item.formattedAmount}
                </Text>
                <Text
                  style={[
                    styles.typeLabel,
                    isIncome ? styles.typeLabelIncome : styles.typeLabelOutcome,
                  ]}
                >
                  {isIncome ? 'Income' : 'Outcome'}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query or filter options.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  sliderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.forestGreen,
    borderColor: Colors.forestGreen,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
    gap: 12,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  txBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  txSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '400',
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  amountIncome: {
    color: Colors.forestGreen,
  },
  amountOutcome: {
    color: Colors.slateExpense,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  typeLabelIncome: {
    color: Colors.forestGreen,
  },
  typeLabelOutcome: {
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

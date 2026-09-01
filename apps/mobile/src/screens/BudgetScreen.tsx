import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddBudgetModal } from '../components/budget/AddBudgetModal';
import { BudgetHeader } from '../components/budget/BudgetHeader';
import { CategoryBreakdownList } from '../components/budget/CategoryBreakdownList';
import { CategoryDonutChart } from '../components/budget/CategoryDonutChart';
import { CategoryDetailModal } from '../components/budget/CategoryDetailModal';
import { N26SpacesCarousel } from '../components/budget/N26SpacesCarousel';
import { PeriodPickerModal } from '../components/budget/PeriodPickerModal';
import { QuickActionsBar } from '../components/budget/QuickActionsBar';
import { BudgetTab, SegmentedControl } from '../components/budget/SegmentedControl';
import { SpendingTrendChart } from '../components/budget/SpendingTrendChart';
import { SummaryCards } from '../components/budget/SummaryCards';
import {
  MOCK_BUDGET_OVERVIEW,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_INCOME_CATEGORIES,
  PERIOD_OPTIONS,
} from '../data/mockBudgetData';
import { Colors } from '../theme/colors';
import { CategoryItem, PeriodOption } from '../types/budget';

export function BudgetScreen() {
  const insets = useSafeAreaInsets();

  // Ensure top padding is never clipped by the battery/status bar in Expo Go
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const [activeTab, setActiveTab] = useState<BudgetTab>('overview');
  const [breakdownMode, setBreakdownMode] = useState<'expense' | 'income'>('expense');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(PERIOD_OPTIONS[0]);

  // Modals state
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false);
  const [isAddBudgetModalVisible, setIsAddBudgetModalVisible] = useState(false);
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<CategoryItem | null>(null);

  // Active chart slice filter
  const [selectedDonutCategory, setSelectedDonutCategory] = useState<CategoryItem | null>(null);

  // Dynamic state for categories and budget limits
  const [expenseCategories, setExpenseCategories] = useState<CategoryItem[]>(MOCK_EXPENSE_CATEGORIES);
  const [incomeCategories] = useState<CategoryItem[]>(MOCK_INCOME_CATEGORIES);
  const [refreshing, setRefreshing] = useState(false);

  const activeCategories =
    breakdownMode === 'expense' ? expenseCategories : incomeCategories;

  const currentTotalAmount =
    breakdownMode === 'expense'
      ? MOCK_BUDGET_OVERVIEW.totalExpense
      : MOCK_BUDGET_OVERVIEW.totalIncome;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const handleUpdateBudgetLimit = (categoryId: string, newLimit: number) => {
    setExpenseCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, budgetLimit: newLimit } : cat
      )
    );
  };

  const handleAddBudget = (categoryId: string, addedAmount: number) => {
    setExpenseCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              budgetLimit: cat.budgetLimit + addedAmount,
            }
          : cat
      )
    );
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* Clean Borderless Header */}
      <BudgetHeader
        selectedPeriod={selectedPeriod.label}
        onPressPeriod={() => setIsPeriodModalVisible(true)}
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.forestGreen}
            colors={[Colors.forestGreen]}
          />
        }
      >
        {/* Massive Hero Net Cashflow + Borderless Income/Expense Text Summaries */}
        <SummaryCards
          expenseAmount={MOCK_BUDGET_OVERVIEW.totalExpense}
          incomeAmount={MOCK_BUDGET_OVERVIEW.totalIncome}
          netSavings={MOCK_BUDGET_OVERVIEW.netSavings}
          savingsRate={MOCK_BUDGET_OVERVIEW.savingsRate}
          onPressExpense={() => {
            setActiveTab('breakdown');
            setBreakdownMode('expense');
          }}
          onPressIncome={() => {
            setActiveTab('breakdown');
            setBreakdownMode('income');
          }}
        />

        {/* Compact Horizontal Row of Minimal Action Icons */}
        <QuickActionsBar
          onAddBudget={() => setIsAddBudgetModalVisible(true)}
          onTransfer={() => setIsAddBudgetModalVisible(true)}
          onSchedule={() => {}}
          onExport={() => {}}
        />

        {/* Clean Borderless Toggle at top of insights */}
        <SegmentedControl
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            setSelectedDonutCategory(null);
          }}
        />

        {activeTab === 'overview' ? (
          /* ==================== OVERVIEW VIEW ==================== */
          <View style={styles.tabContent}>
            {/* Single Consolidated Minimalist Chart (No heavy gridlines!) */}
            <SpendingTrendChart data={MOCK_BUDGET_OVERVIEW.spendingTrend} />

            {/* Borderless N26 Spaces / Sub-Wallets Carousel */}
            <N26SpacesCarousel
              spaces={MOCK_BUDGET_OVERVIEW.spaces}
              onSelectSpace={() => {}}
            />
          </View>
        ) : (
          /* ==================== BREAKDOWN VIEW ==================== */
          <View style={styles.tabContent}>
            {/* Perfectly Circular Minimalist Donut Chart with Coinbase Center Display */}
            <CategoryDonutChart
              categories={activeCategories}
              totalAmount={currentTotalAmount}
              mode={breakdownMode}
              onChangeMode={(mode) => setBreakdownMode(mode)}
              selectedCategory={selectedDonutCategory}
              onSelectCategory={(cat) => setSelectedDonutCategory(cat)}
            />

            {/* Edge-to-Edge Category Breakdown List in Rupees */}
            <CategoryBreakdownList
              categories={activeCategories}
              selectedCategoryId={selectedDonutCategory?.id}
              onSelectCategory={(cat) => {
                setSelectedDonutCategory(cat);
                setSelectedCategoryDetail(cat);
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Period Selection Modal */}
      <PeriodPickerModal
        visible={isPeriodModalVisible}
        options={PERIOD_OPTIONS}
        selectedPeriodId={selectedPeriod.id}
        onSelectPeriod={(opt) => setSelectedPeriod(opt)}
        onClose={() => setIsPeriodModalVisible(false)}
      />

      {/* Category Drilldown Bottom Sheet */}
      <CategoryDetailModal
        visible={!!selectedCategoryDetail}
        category={selectedCategoryDetail}
        onClose={() => setSelectedCategoryDetail(null)}
        onUpdateBudgetLimit={handleUpdateBudgetLimit}
      />

      {/* Set Budget Cap Modal */}
      <AddBudgetModal
        visible={isAddBudgetModalVisible}
        categories={expenseCategories}
        onClose={() => setIsAddBudgetModalVisible(false)}
        onAddBudget={handleAddBudget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    flex: 1,
  },
});

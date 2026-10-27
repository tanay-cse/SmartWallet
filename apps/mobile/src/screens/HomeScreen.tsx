import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon, ChevronRightIcon, PlusIcon } from '../components/icons/BudgetIcons';
import { SWLogo } from '../components/icons/SWLogo';
import {
  BellIcon,
  BrandIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  ShareIcon,
} from '../components/icons/TabIcon';
import { CardNetwork } from '../types/vault';
import { CardNetworkLogo } from '../components/vault/CardNetworkLogo';
import { ChipIcon, ContactlessIcon } from '../components/icons/VaultIcons';
import { MOCK_EXPENSE_CATEGORIES } from '../data/mockBudgetData';
import {
  fetchCardSummary,
  fetchTransactions,
  fetchUserCards,
  CardSummaryResult,
  BackendTransaction,
} from '../services/api';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(320, SCREEN_WIDTH - 56);

interface HomeCardItem {
  cardId: string;
  name: string;
  bank: string;
  network: string;
  last4: string;
  cardholderName: string;
  availableLimit: number;
  gradientColors: [string, string, string];
}

const DEFAULT_GRADIENTS: Array<[string, string, string]> = [
  ['#0F172A', '#1E293B', '#334155'], // Slate Obsidian
  ['#064E3B', '#047857', '#10B981'], // Emerald Forest
  ['#312E81', '#4338CA', '#6366F1'], // Indigo Night
];

function normalizeCardNetwork(net?: string): CardNetwork {
  const n = (net || '').toLowerCase();
  if (n.includes('master')) return 'mastercard';
  if (n.includes('rupay')) return 'rupay';
  if (n.includes('amex') || n.includes('american')) return 'amex';
  return 'visa';
}

function formatTxnTime(timeString: string | Date | undefined): string {
  if (!timeString) return 'Just now';
  try {
    const d = new Date(timeString);
    if (isNaN(d.getTime())) return 'Recently';
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Recently';
  }
}

function getCategoryIcon(cat?: string): string {
  if (!cat) return 'shopping';
  const c = cat.toLowerCase();
  if (c.includes('din') || c.includes('food') || c.includes('cafe')) return 'coffee';
  if (c.includes('shop')) return 'shopping';
  if (c.includes('trav') || c.includes('flight')) return 'flight';
  if (c.includes('groc')) return 'groceries';
  return 'shopping';
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isUpiHidden, setIsUpiHidden] = useState(false);

  // Real backend cards and summary state
  const [userCards, setUserCards] = useState<HomeCardItem[]>([
    {
      cardId: '5b46c9a3-5763-4d96-a47c-3fba519ceb35',
      name: 'Regalia Gold',
      bank: 'HDFC BANK',
      network: 'VISA',
      last4: '8821',
      cardholderName: 'CHIRAG SHARMA',
      availableLimit: 350000,
      gradientColors: ['#0F172A', '#1E293B', '#334155'],
    },
    {
      cardId: 'card-sapphiro',
      name: 'Sapphiro',
      bank: 'ICICI BANK',
      network: 'MASTERCARD',
      last4: '4192',
      cardholderName: 'CHIRAG SHARMA',
      availableLimit: 250000,
      gradientColors: ['#064E3B', '#047857', '#10B981'],
    },
  ]);
  const [selectedCardId, setSelectedCardId] = useState<string>('5b46c9a3-5763-4d96-a47c-3fba519ceb35');
  const [cardSummary, setCardSummary] = useState<CardSummaryResult | null>(null);
  const [realTransactions, setRealTransactions] = useState<BackendTransaction[]>([]);

  // Loads card summary from backend: GET /cards/:cardId/summary
  const loadCardSummary = React.useCallback(async (cardId: string) => {
    if (!cardId) return;
    const summary = await fetchCardSummary(cardId);
    if (summary) {
      setCardSummary(summary);
    }
  }, []);

  // Auto-refresh summary & transactions whenever HomeScreen comes into view
  // (e.g. immediately after returning from a successful payment on the Pay screen)
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      // 1. Fetch real cards from user vault
      fetchUserCards().then((backendCards) => {
        if (!isMounted) return;
        if (backendCards && backendCards.length > 0) {
          const mapped: HomeCardItem[] = backendCards.map((c, idx) => ({
            cardId: c.cardId,
            name: c.nickname,
            bank: c.network || 'SMARTBANK',
            network: c.network || 'VISA',
            last4: c.tokenId ? c.tokenId.slice(-4) : '8821',
            cardholderName: 'CHIRAG SHARMA',
            availableLimit: 250000,
            gradientColors: DEFAULT_GRADIENTS[idx % DEFAULT_GRADIENTS.length],
          }));
          setUserCards(mapped);
          if (!mapped.some((item) => item.cardId === selectedCardId)) {
            setSelectedCardId(mapped[0].cardId);
            loadCardSummary(mapped[0].cardId);
          } else {
            loadCardSummary(selectedCardId);
          }
        } else {
          loadCardSummary(selectedCardId);
        }
      });

      // 2. Fetch live transactions
      fetchTransactions().then((txns) => {
        if (!isMounted) return;
        setRealTransactions(txns);
      });

      return () => {
        isMounted = false;
      };
    }, [selectedCardId, loadCardSummary])
  );

  // Switch card and fetch its summary
  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    loadCardSummary(cardId);
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  // 60fps Native Animated Scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  // Safe scroll interpolations for the bottom UPI QR reveal
  const qrScale = scrollY.interpolate({
    inputRange: [40, 240],
    outputRange: [0.9, 1],
    extrapolate: 'clamp',
  });

  const qrTranslateY = scrollY.interpolate({
    inputRange: [40, 240],
    outputRange: [30, 0],
    extrapolate: 'clamp',
  });

  const qrOpacity = scrollY.interpolate({
    inputRange: [40, 180],
    outputRange: [0.4, 1],
    extrapolate: 'clamp',
  });

  // Top spending categories sorted descending by amount (highest spend first)
  const sortedTopCategories = useMemo(() => {
    return [...MOCK_EXPENSE_CATEGORIES]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, []);

  // Dynamic balance that decrements on successful transactions on this card
  const cardSpent = useMemo(() => {
    return realTransactions
      .filter((t) => t.status === 'SUCCESS' && (!t.cardId || t.cardId === selectedCardId))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [realTransactions, selectedCardId]);

  const baseBalance = cardSummary?.mockBalance ?? 125458.5;
  const currentBalance = Math.max(0, baseBalance - cardSpent);

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* Main Animated ScrollView with Native Driver */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ==================== HERO TOP BAR ==================== */}
        <View style={styles.topHeader}>
          {/* User Welcome Row with SW Brand Logo */}
          <View style={styles.userProfileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>C</Text>
            </View>
            <View>
              <View style={styles.brandRow}>
                <Text style={styles.userName}>Chirag</Text>
                <SWLogo size={18} />
              </View>
              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
          </View>

          {/* Action Icons: Bell (routing to Notifications) & Profile Avatar */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity
              style={styles.iconCircleButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <BellIcon size={18} color={Colors.textPrimary} />
              <View style={styles.notificationBadgeDot} />
            </TouchableOpacity>

            {/* Profile Avatar Button (Navigates to ProfileScreen) */}
            <TouchableOpacity
              style={styles.profileAvatarBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
              accessibilityLabel="Profile"
            >
              <Text style={styles.profileAvatarText}>C</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================== CURRENT BALANCE HERO ==================== */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceLabelRow}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceHidden(!isBalanceHidden)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              {isBalanceHidden ? (
                <EyeOffIcon size={16} color={Colors.textSecondary} />
              ) : (
                <EyeIcon size={16} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceValue}>
            {isBalanceHidden
              ? '₹••••••'
              : `₹${currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </Text>

          {/* Real Card Summary Metrics (pointsEarnedThisCycle & bestCategory) */}
          <View style={styles.cardMetricsRow}>
            <View style={styles.metricPill}>
              <Text style={styles.metricPillIcon}>⭐</Text>
              <Text style={styles.metricPillLabel}>Cycle Points:</Text>
              <Text style={styles.metricPillValue}>
                {cardSummary?.pointsEarnedThisCycle !== undefined
                  ? `${cardSummary.pointsEarnedThisCycle} pts`
                  : '142 pts'}
              </Text>
            </View>

            <View style={styles.metricPill}>
              <Text style={styles.metricPillIcon}>⚡</Text>
              <Text style={styles.metricPillLabel}>Best Category:</Text>
              <Text style={styles.metricPillValue}>
                {cardSummary?.bestCategory
                  ? `${cardSummary.bestCategory} (${cardSummary.bestMultiplier || '5'}x)`
                  : 'Dining (5x)'}
              </Text>
            </View>
          </View>
        </View>

        {/* ==================== HORIZONTAL CARDS SCROLLVIEW ==================== */}
        <View style={styles.horizontalCardsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardsContent}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 14}
          >
            {userCards.map((card) => {
              const isSelected = card.cardId === selectedCardId;
              const gradId = `homeGrad-${card.cardId}`;
              const formattedLimit = `₹${card.availableLimit.toLocaleString('en-IN')}`;

              return (
                <TouchableOpacity
                  key={card.cardId}
                  style={[
                    styles.cardContainer,
                    isSelected && styles.cardContainerActive,
                    {
                      width: CARD_WIDTH,
                      backgroundColor: card.gradientColors[0],
                    },
                  ]}
                  onPress={() => handleSelectCard(card.cardId)}
                  activeOpacity={0.9}
                >
                  {/* SVG Gradient Background */}
                  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                      <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor={card.gradientColors[0]} />
                        <Stop offset="60%" stopColor={card.gradientColors[1]} />
                        <Stop
                          offset="100%"
                          stopColor={card.gradientColors[2] || card.gradientColors[1]}
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" rx="18" fill={`url(#${gradId})`} />
                    <Circle cx="85%" cy="30%" r="65" fill="#FFFFFF" fillOpacity="0.04" />
                    <Circle cx="90%" cy="80%" r="50" fill="#FFFFFF" fillOpacity="0.03" />
                  </Svg>

                  {/* Card Inner Content */}
                  <View style={styles.cardInner}>
                    <View style={styles.cardTopRow}>
                      <View>
                        <Text style={styles.cardBankLabel}>{card.bank}</Text>
                        <Text style={styles.cardNameLabel}>{card.name}</Text>
                      </View>
                      <View style={styles.cardTopRight}>
                        {isSelected && (
                          <View style={styles.activeCardBadge}>
                            <Text style={styles.activeCardBadgeText}>SELECTED</Text>
                          </View>
                        )}
                        <CardNetworkLogo network={normalizeCardNetwork(card.network)} size={36} />
                      </View>
                    </View>

                    <View style={styles.cardMiddleRow}>
                      <ChipIcon size={26} />
                      <ContactlessIcon size={16} color="rgba(255, 255, 255, 0.75)" />
                    </View>

                    <View style={styles.cardBottomRow}>
                      <View>
                        <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
                        <Text style={styles.cardholderText}>{card.cardholderName}</Text>
                      </View>
                      <View style={styles.limitCol}>
                        <Text style={styles.limitLabel}>
                          {isSelected ? 'Active Card' : 'Tap to Select'}
                        </Text>
                        <Text style={styles.limitValue}>{formattedLimit}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Final "See details" Vault Redirection Card */}
            <TouchableOpacity
              style={[styles.cardContainer, styles.seeDetailsCard, { width: 140 }]}
              onPress={() => navigation.navigate('Vault')}
              activeOpacity={0.8}
            >
              <View style={styles.seeDetailsCircle}>
                <PlusIcon size={20} color={Colors.forestGreen} />
              </View>
              <Text style={styles.seeDetailsTitle}>See details</Text>
              <Text style={styles.seeDetailsSubtitle}>Manage Vault</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ==================== QUICK STATS (Clickable -> Budget Overview) ==================== */}
        <View style={styles.quickStatsRow}>
          {/* Total Spent Block */}
          <TouchableOpacity
            style={styles.statBlock}
            onPress={() => navigation.navigate('Budget', { tab: 'overview' })}
            activeOpacity={0.7}
          >
            <View style={styles.statHeaderRow}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <ChevronRightIcon size={14} color={Colors.forestGreen} />
            </View>
            <Text style={styles.statAmount}>+₹5,420.00</Text>
            <View style={styles.trendPillNeutral}>
              <Text style={styles.trendPillNeutralText}>↘ 8%</Text>
            </View>
          </TouchableOpacity>

          {/* Saved Block */}
          <TouchableOpacity
            style={styles.statBlock}
            onPress={() => navigation.navigate('Budget', { tab: 'overview' })}
            activeOpacity={0.7}
          >
            <View style={styles.statHeaderRow}>
              <Text style={styles.statLabel}>Saved</Text>
              <ChevronRightIcon size={14} color={Colors.forestGreen} />
            </View>
            <Text style={styles.statAmount}>+₹5,420.00</Text>
            <View style={styles.trendPillGreen}>
              <Text style={styles.trendPillGreenText}>↗ 8%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ==================== TOP SPENDING CATEGORIES SECTION (Sorted Descending) ==================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Category Spends</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Budget', { tab: 'breakdown' })}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryListWrapper}>
            {sortedTopCategories.map((cat, index) => {
              const isLast = index === sortedTopCategories.length - 1;
              const formattedAmount = `₹${cat.amount.toLocaleString('en-IN')}`;
              const percentSpentOfLimit = Math.min(
                100,
                Math.round((cat.amount / cat.budgetLimit) * 100)
              );

              return (
                <View
                  key={cat.id}
                  style={[styles.categoryRow, !isLast && styles.categoryRowBorder]}
                >
                  <View style={[styles.categoryIconCircle, { backgroundColor: cat.bgColor }]}>
                    <CategoryIcon categoryKey={cat.key} size={18} color={cat.color} />
                  </View>

                  <View style={styles.categoryInfoCol}>
                    <View style={styles.categoryTitleLine}>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryPercent}>{cat.percentage}%</Text>
                    </View>

                    <View style={styles.categoryProgressRow}>
                      <View style={styles.categoryProgressBg}>
                        <View
                          style={[
                            styles.categoryProgressFill,
                            {
                              width: `${percentSpentOfLimit}%`,
                              backgroundColor:
                                percentSpentOfLimit > 90 ? Colors.warning : Colors.forestGreen,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.categoryLimit}>
                        ₹{cat.budgetLimit.toLocaleString('en-IN')} cap
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.categoryAmountText}>{formattedAmount}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ==================== RECENT TRANSACTIONS ==================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {realTransactions.length === 0 ? (
            <View style={styles.emptyTxBox}>
              <Text style={styles.emptyTxTitle}>No transactions recorded yet</Text>
              <Text style={styles.emptyTxSub}>
                Make a payment on the Pay tab to see your sandboxed UPI settlements here.
              </Text>
            </View>
          ) : (
            <View style={styles.recentListWrapper}>
              {realTransactions.slice(0, 4).map((tx, index) => {
                const isLast = index === Math.min(realTransactions.length, 4) - 1;
                const isPending = tx.status === 'PENDING';
                const isSuccess = tx.status === 'SUCCESS';
                const isFailed = tx.status === 'FAILED';

                return (
                  <View
                    key={tx.txnId}
                    style={[styles.recentTxItem, !isLast && styles.recentTxBorder]}
                  >
                    <View style={styles.recentIconBox}>
                      <BrandIcon
                        name={getCategoryIcon(tx.category)}
                        size={18}
                        color={Colors.textPrimary}
                      />
                    </View>

                    <View style={styles.recentTxDetails}>
                      <Text style={styles.recentTxTitle} numberOfLines={1}>
                        {tx.payeeUpiId ? `To ${tx.payeeUpiId}` : `${tx.category} Payment`}
                      </Text>
                      <View style={styles.txMetaRow}>
                        <Text style={styles.recentTxDate}>{formatTxnTime(tx.txnTime)}</Text>
                        <Text style={styles.txDotSeparator}>•</Text>
                        <Text style={styles.txCategoryTag}>{tx.category}</Text>
                      </View>
                    </View>

                    <View style={styles.txAmountCol}>
                      <Text style={styles.recentTxAmount}>
                        -₹{tx.amount.toLocaleString('en-IN')}
                      </Text>

                      {/* Status badge: style PENDING differently from SUCCESS */}
                      {isPending && (
                        <View style={styles.badgePending}>
                          <Text style={styles.badgePendingText}>PENDING</Text>
                        </View>
                      )}
                      {isSuccess && (
                        <View style={styles.badgeSuccess}>
                          <Text style={styles.badgeSuccessText}>SUCCESS</Text>
                        </View>
                      )}
                      {isFailed && (
                        <View style={styles.badgeFailed}>
                          <Text style={styles.badgeFailedText}>FAILED</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ==================== UPI QR CODE REVEAL ON SCROLL ==================== */}
        <Animated.View
          style={[
            styles.myQrSection,
            {
              transform: [{ scale: qrScale }, { translateY: qrTranslateY }],
              opacity: qrOpacity,
            },
          ]}
        >
          <Text style={styles.myQrSectionTitle}>My QR</Text>

          <View style={styles.myQrCard}>
            {/* Top UPI handle row */}
            <View style={styles.qrCardHeader}>
              <TouchableOpacity
                onPress={() => setIsUpiHidden(!isUpiHidden)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isUpiHidden ? (
                  <EyeOffIcon size={16} color="rgba(255, 255, 255, 0.7)" />
                ) : (
                  <EyeIcon size={16} color="rgba(255, 255, 255, 0.7)" />
                )}
              </TouchableOpacity>

              <Text style={styles.upiHandleText}>
                {isUpiHidden ? '******@upi' : '******9077@upi'}
              </Text>

              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <CopyIcon size={16} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Real Crystal Clear High-Resolution QR Code Image */}
            <View style={styles.qrCodeCenter}>
              <Image
                source={require('../../assets/real-qr-code.png')}
                style={styles.realQrImage}
                resizeMode="contain"
              />
            </View>

            {/* Actions: Download & Share */}
            <View style={styles.qrActionsRow}>
              <TouchableOpacity style={styles.qrActionBtn} activeOpacity={0.8}>
                <DownloadIcon size={15} color="#FFFFFF" />
                <Text style={styles.qrActionBtnText}>Download QR</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.qrActionBtn} activeOpacity={0.8}>
                <ShareIcon size={15} color="#FFFFFF" />
                <Text style={styles.qrActionBtnText}>Share QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 120, // Margin to reveal QR card above the floating pill tab bar
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.forestGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  welcomeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.forestGreen,
  },
  profileAvatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceSection: {
    marginTop: 12,
    marginBottom: 16,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  horizontalCardsWrapper: {
    marginHorizontal: -20,
    marginBottom: 20,
  },
  horizontalCardsContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  cardContainer: {
    height: 185,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBankLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardNameLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.8,
    fontVariant: ['tabular-nums'],
  },
  cardholderText: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  limitCol: {
    alignItems: 'flex-end',
  },
  limitLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
  },
  limitValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  seeDetailsCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  seeDetailsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.forestGreenSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeDetailsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  seeDetailsSubtitle: {
    fontSize: 11,
    color: Colors.forestGreen,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBlock: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 14,
    elevation: 0,
    borderWidth: 0,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
    letterSpacing: -0.3,
  },
  trendPillNeutral: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  trendPillNeutralText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slateExpense,
  },
  trendPillGreen: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.forestGreenSubtle,
  },
  trendPillGreenText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.forestGreen,
  },
  categoryListWrapper: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  categoryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  categoryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfoCol: {
    flex: 1,
  },
  categoryTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  categoryProgressBg: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  categoryLimit: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  recentListWrapper: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  recentTxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  recentTxBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  recentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTxDetails: {
    flex: 1,
  },
  recentTxTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  recentTxDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  txDotSeparator: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  txCategoryTag: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.forestGreen,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  recentTxAmount: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.slateExpense,
    fontVariant: ['tabular-nums'],
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgePendingText: {
    color: '#D97706',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  badgeSuccess: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeSuccessText: {
    color: '#059669',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  badgeFailed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeFailedText: {
    color: '#DC2626',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  emptyTxBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyTxSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  cardMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  metricPillIcon: {
    fontSize: 12,
  },
  metricPillLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metricPillValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.forestGreen,
  },
  cardContainerActive: {
    borderColor: '#10B981',
    borderWidth: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeCardBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeCardBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  myQrSection: {
    marginTop: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  myQrSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  myQrCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  qrCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  upiHandleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  qrCodeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  realQrImage: {
    width: 250,
    height: 250,
  },
  qrActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 14,
    paddingTop: 12,
  },
  qrActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

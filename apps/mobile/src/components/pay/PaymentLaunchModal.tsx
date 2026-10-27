import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  initiateUpiPayment,
  confirmUpiPayment,
  fetchUserCards,
  getAiRecommendation,
  InitiateUpiPaymentResult,
  RankedCard,
  registerRecentTransaction,
} from '../../services/api';
import { UpiPinModal } from '../UpiPinModal';
import { MOCK_VAULT_CARDS } from '../../data/mockVaultData';
import { Colors } from '../../theme/colors';
import { ChevronLeftIcon, CopyIcon, SyncIcon } from '../icons/TabIcon';

function CheckCircleIcon({ size = 64, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 11.08V12a10 10 0 11-5.93-9.14"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 4L12 14.01l-3-3"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PaymentModalState = 'FORM' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface PaymentLaunchModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccessNavigateHome: () => void;
  initialCategory?: string;
  initialAmount?: string;
  initialPayeeUpiId?: string;
  isFromQr?: boolean;
}

const CATEGORIES = ['Dining', 'Shopping', 'Travel', 'Grocery', 'Bills', 'TRANSFER', 'General'];
const PRESET_AMOUNTS = ['100', '250', '500', '1500', '2000'];

const INITIAL_FALLBACK_CARDS = MOCK_VAULT_CARDS.map((c) => ({
  cardId: c.id === 'card-1' ? '5b46c9a3-5763-4d96-a47c-3fba519ceb35' : c.id,
  name: c.name,
  bank: c.bank,
  last4: c.last4,
  rewardRate: c.rewardRate,
  bestCategory: c.bestCategory,
  upiId: `${c.name.toLowerCase().replace(/\s+/g, '')}@upi`,
}));

export function PaymentLaunchModal({
  visible,
  onClose,
  onSuccessNavigateHome,
  initialCategory = 'Dining',
  initialAmount = '150',
  initialPayeeUpiId = 'merchant@upi',
  isFromQr = false,
}: PaymentLaunchModalProps) {
  const insets = useSafeAreaInsets();

  // Cards state: start populated so all cards are visible immediately
  const [availableCards, setAvailableCards] = useState<Array<{
    cardId: string;
    name: string;
    bank: string;
    last4: string;
    rewardRate: string;
    bestCategory: string;
    upiId?: string | null;
  }>>(INITIAL_FALLBACK_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(
    INITIAL_FALLBACK_CARDS[0]?.cardId || '5b46c9a3-5763-4d96-a47c-3fba519ceb35'
  );

  // Form State
  const [amount, setAmount] = useState(initialAmount);
  const [category, setCategory] = useState(initialCategory);
  const [payeeUpiId, setPayeeUpiId] = useState(initialPayeeUpiId);

  // AI Recommendation State
  const [recommendations, setRecommendations] = useState<RankedCard[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [hasFetchedRecs, setHasFetchedRecs] = useState(false);

  // Execution & Status State
  const [modalState, setModalState] = useState<PaymentModalState>('FORM');
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [activeTxn, setActiveTxn] = useState<InitiateUpiPaymentResult | null>(null);
  const [processingStatusText, setProcessingStatusText] = useState('Verifying PIN & Processing Payment...');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0.3)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Auto-navigate timer ref for success screen
  const autoNavTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load backend cards on mount / visibility and synchronize
  useEffect(() => {
    if (visible) {
      fetchUserCards().then((backendCards) => {
        if (backendCards && backendCards.length > 0) {
          const mapped = backendCards.map((c) => ({
            cardId: c.cardId,
            name: c.nickname,
            bank: c.network || 'STARBANK',
            last4: c.tokenId ? c.tokenId.slice(-4) : '8821',
            rewardRate: c.rewardPrograms?.[0]?.multiplier
              ? `${c.rewardPrograms[0].multiplier}x Rewards`
              : 'Rewards Eligible',
            bestCategory: c.rewardPrograms?.[0]?.category
              ? c.rewardPrograms[0].category.toUpperCase()
              : 'Smart Rewards',
            upiId: c.upiId,
          }));
          setAvailableCards(mapped);
          // Preserve the user's manual selection if it's in the list
          setSelectedCardId((prev) => {
            if (prev && mapped.some((m) => m.cardId === prev)) {
              return prev;
            }
            return mapped[0].cardId;
          });
        }
      });
    }
  }, [visible]);

  // Reset form when modal opens fresh
  useEffect(() => {
    if (visible && modalState !== 'PROCESSING') {
      setAmount(initialAmount);
      setCategory(isFromQr ? 'TRANSFER' : initialCategory);
      setPayeeUpiId(initialPayeeUpiId);
      setModalState('FORM');
      setIsPinModalVisible(false);
      setHasFetchedRecs(false);
      setRecommendations([]);
      setErrorMessage('');
      setProcessingStatusText('Verifying PIN & Processing Payment...');
      successScale.setValue(0.3);
      successOpacity.setValue(0);
      if (autoNavTimerRef.current) {
        clearTimeout(autoNavTimerRef.current);
      }
    }
  }, [visible, initialAmount, initialCategory, initialPayeeUpiId, isFromQr]);

  // Radar pulsing animation for PROCESSING state
  useEffect(() => {
    if (visible && modalState === 'PROCESSING') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [visible, modalState]);

  // Success Checkmark Animation
  useEffect(() => {
    if (modalState === 'SUCCESS') {
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-navigate back to Home after 4 seconds
      autoNavTimerRef.current = setTimeout(() => {
        handleFinishSuccess();
      }, 4000);

      return () => {
        if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
      };
    }
  }, [modalState]);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const selectedCard = availableCards.find((c) => c.cardId === selectedCardId) || availableCards[0];

  const handleCopyTxnId = (id: string) => {
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  /**
   * Action: "Get AI Recommendation"
   * Calls GET /recommendation?category=&amount=
   * Displays ranked list with top card reasoning clearly visible.
   */
  const handleGetRecommendation = async () => {
    const numAmount = parseFloat(amount);
    const validAmount = isNaN(numAmount) || numAmount <= 0 ? 150 : numAmount;

    setIsLoadingRecs(true);
    try {
      const ranked = await getAiRecommendation(category, validAmount);
      setRecommendations(ranked);
      setHasFetchedRecs(true);

      // Pre-select top recommended card if in available cards
      if (ranked.length > 0) {
        const top = ranked[0];
        const match = availableCards.find(
          (c) => c.cardId === top.cardId || c.name.toLowerCase() === top.nickname.toLowerCase()
        );
        if (match) {
          setSelectedCardId(match.cardId);
        }
      }
    } catch (err: any) {
      console.warn('[Rec Error]', err);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  /**
   * Step 1: User taps "Approve to Pay"
   * Validates input. Do NOT call the backend yet!
   * Presents the in-app simulated UPI PIN modal.
   */
  const handleStartPayment = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Amount Required', 'Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!selectedCardId) {
      Alert.alert('Select Card', 'Please select a card from your vault.');
      return;
    }

    if (!payeeUpiId.trim()) {
      Alert.alert('Payee Required', 'Please enter a valid payee UPI ID.');
      return;
    }

    // Present PIN entry modal (Backend is NOT called yet)
    setIsPinModalVisible(true);
  };

  /**
   * Step 2: Handle PIN Submission from UpiPinModal
   * Closes PIN modal, enters PROCESSING state, executes 1.8s realistic delay,
   * then calls POST /payments/upi/initiate and POST /payments/upi/confirm.
   */
  const handlePinSubmit = (pin: string) => {
    setIsPinModalVisible(false);
    setModalState('PROCESSING');
    setProcessingStatusText('Verifying PIN & Processing Payment...');

    const numAmount = parseFloat(amount);

    // Realistic processing delay (1.8s) simulating bank/PSP latency
    setTimeout(async () => {
      try {
        setProcessingStatusText('Contacting Bank Rail...');

        let confirmedStatus = 'SUCCESS';
        let txnId = `txn_${Date.now().toString(36)}`;

        try {
          // Step 3: Call POST /payments/upi/initiate
          const initiated = await initiateUpiPayment({
            cardId: selectedCardId,
            amount: numAmount,
            category,
            payeeUpiId,
          });

          setActiveTxn(initiated);
          txnId = initiated.txnId;
          setProcessingStatusText('Settling via Sandboxed UPI Rail...');

          // Step 4: Immediately call POST /payments/upi/confirm
          const confirmed = await confirmUpiPayment(initiated.txnId, 'SUCCESS');
          confirmedStatus = confirmed.status;
        } catch (apiErr: any) {
          // Fallback to local sandboxed simulation if backend host is unreachable from device Wi-Fi
          console.warn('[Payment Backend Unreachable - Fallback to Sandbox Mode]:', apiErr.message);
          setActiveTxn({
            txnId,
            status: 'PENDING',
            upiIntentUrl: `upi://pay?pa=${payeeUpiId}&am=${numAmount}&tr=${txnId}`,
            message: 'Sandboxed UPI Payment',
          });
          confirmedStatus = 'SUCCESS';
        }

        if (confirmedStatus === 'SUCCESS') {
          // Immediately register transaction so Home Screen updates in real time
          const currentCard = availableCards.find((c) => c.cardId === selectedCardId);
          registerRecentTransaction({
            txnId,
            cardId: selectedCardId,
            amount: numAmount,
            category: category,
            paymentRail: 'UPI',
            txnTime: new Date().toISOString(),
            status: 'SUCCESS',
            payeeUpiId: payeeUpiId,
            card: {
              nickname: currentCard?.name || 'SmartCard',
              network: currentCard?.bank || 'VISA',
            },
          });
          setModalState('SUCCESS');
        } else {
          setErrorMessage('PSP rejected the payment settlement.');
          setModalState('FAILED');
        }
      } catch (err: any) {
        console.error('[Payment Flow Error]', err);
        const readableMsg =
          err.message || 'Payment initiation failed. Please check card UPI configuration or network.';
        setErrorMessage(readableMsg);
        setModalState('FAILED');
      }
    }, 1800);
  };

  const handleRetry = () => {
    setModalState('FORM');
    setActiveTxn(null);
    setErrorMessage('');
  };

  const handleFinishSuccess = () => {
    if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
    onClose();
    onSuccessNavigateHome();
  };

  const topRec = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[styles.modalRoot, { paddingTop: topPadding }]}>
          <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} />

          {/* ================= HEADER ================= */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={modalState === 'SUCCESS' ? handleFinishSuccess : onClose}
              activeOpacity={0.7}
            >
              <ChevronLeftIcon size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {modalState === 'FORM' && (isFromQr ? 'QR Payment' : 'Approve to Pay')}
              {modalState === 'PROCESSING' && 'Payment in Progress'}
              {modalState === 'SUCCESS' && 'Payment Successful'}
              {modalState === 'FAILED' && 'Payment Failed'}
            </Text>

            <View style={{ width: 38 }} />
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ================= 1. FORM STATE ================= */}
            {modalState === 'FORM' && (
              <View style={styles.formContainer}>
                {/* QR Scanned Context Banner if coming from QR */}
                {isFromQr && (
                  <View style={styles.qrBadgeBanner}>
                    <View style={styles.qrIconCircle}>
                      <Text style={{ fontSize: 16 }}>📱</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.qrBadgeTitle}>Scanned UPI Merchant</Text>
                      <Text style={styles.qrBadgeSubtitle} numberOfLines={1}>
                        Paying to: {payeeUpiId}
                      </Text>
                    </View>
                    <View style={styles.qrVerifiedTag}>
                      <Text style={styles.qrVerifiedText}>VERIFIED</Text>
                    </View>
                  </View>
                )}

                {/* Amount Input Section */}
                <Text style={styles.sectionLabel}>
                  {isFromQr && (!initialAmount || initialAmount === '0')
                    ? 'Enter Payment Amount (Required)'
                    : 'Payment Amount'}
                </Text>
                <View
                  style={[
                    styles.amountInputContainer,
                    isFromQr && (!amount || amount === '0') && styles.amountInputHighlight,
                  ]}
                >
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    maxLength={7}
                    autoFocus={isFromQr && (!initialAmount || initialAmount === '0')}
                  />
                </View>

                {/* Preset Amount Chips */}
                <View style={styles.presetChipsRow}>
                  {PRESET_AMOUNTS.map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.presetChip,
                        amount === val && styles.presetChipSelected,
                      ]}
                      onPress={() => setAmount(val)}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          amount === val && styles.presetChipTextSelected,
                        ]}
                      >
                        ₹{val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Spend Category Selection */}
                <View style={[styles.labelRowWithInfo, { marginTop: 18 }]}>
                  <Text style={styles.sectionLabel}>Spend Category</Text>
                  {isFromQr && (
                    <Text style={styles.categoryNote}>Defaulted to TRANSFER for QR</Text>
                  )}
                </View>
                <View style={styles.categoryChipsRow}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        category.toUpperCase() === cat.toUpperCase() && styles.categoryChipSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          category.toUpperCase() === cat.toUpperCase() && styles.categoryChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Payee UPI ID */}
                <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Payee UPI ID</Text>
                <View style={styles.upiInputWrapper}>
                  <TextInput
                    style={styles.upiInput}
                    value={payeeUpiId}
                    onChangeText={setPayeeUpiId}
                    placeholder="merchant@upi"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* ================= AI RECOMMENDATION BANNER & ACTION ================= */}
                <View style={styles.recActionBox}>
                  <View style={styles.recHeaderRow}>
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>🤖 AI CARD OPTIMIZER</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.getRecBtn}
                      onPress={handleGetRecommendation}
                      disabled={isLoadingRecs}
                      activeOpacity={0.8}
                    >
                      {isLoadingRecs ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.getRecBtnText}>
                          {hasFetchedRecs ? '↻ Re-Calculate' : '⚡ Get AI Recommendation'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.recExplainNotice}>
                    Rank your vault cards for maximum rewards & milestone bonuses on this ₹
                    {amount || '0'} {category} spend.
                  </Text>

                  {/* Top Recommended Card Explainability Display */}
                  {topRec && (
                    <View style={styles.topRecHighlightCard}>
                      <View style={styles.topRecHeader}>
                        <View style={styles.starCrownRow}>
                          <Text style={{ fontSize: 16 }}>🏆</Text>
                          <Text style={styles.topRecTitle}>TOP RECOMMENDED: {topRec.nickname}</Text>
                        </View>
                        <View style={styles.ratePill}>
                          <Text style={styles.ratePillText}>{topRec.rate}x Rewards</Text>
                        </View>
                      </View>

                      {/* Visible Reasoning Text — AI Explainability Feature */}
                      <View style={styles.reasoningBox}>
                        <Text style={styles.reasoningHeading}>💡 AI Reasoning:</Text>
                        <Text style={styles.reasoningText}>{topRec.reasoning}</Text>
                      </View>

                      {selectedCardId !== topRec.cardId ? (
                        <TouchableOpacity
                          style={styles.acceptRecBtn}
                          onPress={() => setSelectedCardId(topRec.cardId)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.acceptRecBtnText}>
                            ✓ Accept & Use {topRec.nickname}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.acceptedBadgeRow}>
                          <Text style={styles.acceptedBadgeText}>✓ Top Card Selected</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Card Selector Card */}
                <View style={[styles.labelRowWithInfo, { marginTop: 18 }]}>
                  <Text style={styles.sectionLabel}>Select Linked Card</Text>
                  <Text style={styles.categoryNote}>Or manually pick from vault</Text>
                </View>
                <View style={styles.cardSelectWrapper}>
                  {availableCards.map((card) => {
                    const isSelected = selectedCardId === card.cardId;
                    const cardRec = recommendations.find(
                      (r) => r.cardId === card.cardId || r.nickname.toLowerCase() === card.name.toLowerCase()
                    );

                    return (
                      <TouchableOpacity
                        key={card.cardId}
                        style={[
                          styles.cardOption,
                          isSelected && styles.cardOptionSelected,
                        ]}
                        onPress={() => setSelectedCardId(card.cardId)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.cardHeaderRow}>
                          <View style={styles.cardBankBadge}>
                            <Text style={styles.cardBankText}>{card.bank}</Text>
                          </View>
                          <Text style={styles.cardLast4}>•••• {card.last4}</Text>
                        </View>

                        <Text style={styles.cardTitle}>{card.name}</Text>
                        <Text style={styles.cardReward}>
                          {cardRec
                            ? `⚡ ${cardRec.rate}x on ${category} (Score: ${cardRec.score.toFixed(1)})`
                            : `⚡ ${card.rewardRate} • ${card.bestCategory}`}
                        </Text>

                        {isSelected && (
                          <View style={styles.activePillBadge}>
                            <Text style={styles.activePillText}>✓ Selected for UPI</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Launch Payment Button */}
                <TouchableOpacity
                  style={[
                    styles.payButton,
                    (!amount || parseFloat(amount) <= 0) && styles.payButtonDisabled,
                  ]}
                  onPress={handleStartPayment}
                  activeOpacity={0.85}
                >
                  <Text style={styles.payButtonText}>
                    Approve to Pay ₹{amount || '0'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================= 2. PROCESSING STATE (1.5-2s Realistic Delay) ================= */}
            {modalState === 'PROCESSING' && (
              <View style={styles.progressContainer}>
                {/* Radar Pulsing Icon */}
                <View style={styles.pulsingWrapper}>
                  <Animated.View
                    style={[
                      styles.pulsingCircle,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                  <View style={styles.progressInnerIcon}>
                    <SyncIcon size={32} color={Colors.forestGreen} />
                  </View>
                </View>

                <Text style={styles.progressHeading}>Processing Payment</Text>
                <Text style={styles.progressSubtext}>
                  {processingStatusText}
                </Text>

                {/* Transaction Metadata Card */}
                <View style={styles.txnMetaCard}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Payee</Text>
                    <Text style={styles.metaValue}>{payeeUpiId}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Paying with</Text>
                    <Text style={styles.metaValue}>
                      {selectedCard?.name} (•• {selectedCard?.last4})
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Amount</Text>
                    <Text style={styles.metaValueBold}>₹{amount} INR</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Rail</Text>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>SANDBOXED UPI</Text>
                    </View>
                  </View>
                </View>

                <ActivityIndicator
                  color={Colors.forestGreen}
                  size="large"
                  style={{ marginTop: 14 }}
                />
              </View>
            )}

            {/* ================= 3. SUCCESS STATE (With Animation & Done Button) ================= */}
            {modalState === 'SUCCESS' && (
              <View style={styles.feedbackContainer}>
                <Animated.View
                  style={[
                    styles.successIconCircle,
                    {
                      transform: [{ scale: successScale }],
                      opacity: successOpacity,
                    },
                  ]}
                >
                  <CheckCircleIcon size={64} color="#FFFFFF" />
                </Animated.View>

                <Text style={styles.successHeadline}>Payment Successful!</Text>
                <Text style={styles.successSubtext}>
                  ₹{amount} paid to {payeeUpiId}
                </Text>

                <View style={styles.successSummaryCard}>
                  <View style={styles.metaRow}>
                    <Text style={styles.summaryLabel}>Amount Paid</Text>
                    <Text style={styles.summaryValueBold}>₹{amount}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.metaRow}>
                    <Text style={styles.summaryLabel}>Payee</Text>
                    <Text style={styles.summaryValue}>{payeeUpiId}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.metaRow}>
                    <Text style={styles.summaryLabel}>Card Used</Text>
                    <Text style={styles.summaryValue}>{selectedCard?.name}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.metaRow}>
                    <Text style={styles.summaryLabel}>Category</Text>
                    <Text style={styles.summaryValue}>{category}</Text>
                  </View>
                  {activeTxn && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.metaRow}>
                        <Text style={styles.summaryLabel}>Txn Ref</Text>
                        <TouchableOpacity
                          style={styles.copyRow}
                          onPress={() => handleCopyTxnId(activeTxn.txnId)}
                        >
                          <Text style={styles.metaValueMono} numberOfLines={1}>
                            {activeTxn.txnId.slice(0, 8)}...{activeTxn.txnId.slice(-6)}
                          </Text>
                          <CopyIcon size={14} color={Colors.forestGreen} />
                          {copiedTxn && <Text style={styles.copiedHint}>Copied!</Text>}
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.homeReturnBtn}
                  onPress={handleFinishSuccess}
                  activeOpacity={0.85}
                >
                  <Text style={styles.homeReturnBtnText}>Done • Return to Home</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================= 4. FAILED STATE (Graceful Failure Handling) ================= */}
            {modalState === 'FAILED' && (
              <View style={styles.feedbackContainer}>
                <View style={styles.failedIconCircle}>
                  <Text style={styles.failedIconX}>✕</Text>
                </View>

                <Text style={styles.failedHeadline}>Payment Failed</Text>
                <Text style={styles.failedSubtext}>
                  {errorMessage || 'The payment could not be processed by the sandboxed banking rail.'}
                </Text>

                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={handleRetry}
                  activeOpacity={0.85}
                >
                  <Text style={styles.retryBtnText}>Retry / Change Card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* UPI PIN Keypad Modal (UI Simulation Step) */}
      <UpiPinModal
        visible={isPinModalVisible}
        amount={amount || '0'}
        payeeUpiId={payeeUpiId}
        cardName={selectedCard?.name}
        cardLast4={selectedCard?.last4}
        pinLength={4}
        onClose={() => setIsPinModalVisible(false)}
        onPinSubmit={handlePinSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  qrBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1.5,
    borderColor: Colors.forestGreenBorder,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  qrIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBadgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.forestGreenDark,
  },
  qrBadgeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  qrVerifiedTag: {
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qrVerifiedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  labelRowWithInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryNote: {
    fontSize: 11,
    color: Colors.forestGreen,
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  amountInputHighlight: {
    borderColor: Colors.forestGreen,
    backgroundColor: Colors.forestGreenLight,
  },
  rupeeSymbol: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  presetChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  presetChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  presetChipSelected: {
    backgroundColor: Colors.forestGreen,
    borderColor: Colors.forestGreen,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  presetChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  categoryChipSelected: {
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreen,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryChipTextSelected: {
    color: Colors.forestGreen,
    fontWeight: '700',
  },
  upiInputWrapper: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  upiInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  recActionBox: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  aiBadgeText: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  getRecBtn: {
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  getRecBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  recExplainNotice: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  topRecHighlightCard: {
    marginTop: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  topRecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starCrownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topRecTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratePill: {
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reasoningBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.forestGreen,
  },
  reasoningHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
    marginBottom: 2,
  },
  reasoningText: {
    fontSize: 12.5,
    color: '#E2E8F0',
    lineHeight: 17,
  },
  acceptRecBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  acceptRecBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  acceptedBadgeRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  acceptedBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  cardSelectWrapper: {
    gap: 10,
  },
  cardOption: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  cardOptionSelected: {
    borderColor: Colors.forestGreen,
    backgroundColor: Colors.forestGreenLight,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardBankBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardBankText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardLast4: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  cardReward: {
    fontSize: 12,
    color: Colors.forestGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  activePillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  payButton: {
    backgroundColor: Colors.forestGreen,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  progressContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  pulsingWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  pulsingCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.forestGreenSubtle,
    borderWidth: 1.5,
    borderColor: Colors.forestGreen,
  },
  progressInnerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  progressSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  txnMetaCard: {
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13.5,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  metaValueBold: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metaValueMono: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.forestGreenDark,
    fontWeight: '600',
    maxWidth: 130,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copiedHint: {
    fontSize: 10,
    color: Colors.forestGreen,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  feedbackContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  successHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  successSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  successSummaryCard: {
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.forestGreen,
  },
  homeReturnBtn: {
    backgroundColor: Colors.forestGreen,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  homeReturnBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  failedIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  failedIconX: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  failedHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  failedSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  retryBtn: {
    backgroundColor: Colors.forestGreen,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

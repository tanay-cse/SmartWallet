import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusIcon } from '../components/icons/BudgetIcons';
import { ChipIcon, ContactlessIcon, RewardStarIcon } from '../components/icons/VaultIcons';
import { AddCardModal } from '../components/vault/AddCardModal';
import { CardNetworkLogo } from '../components/vault/CardNetworkLogo';
import { VaultHeader } from '../components/vault/VaultHeader';
import { MOCK_VAULT_CARDS } from '../data/mockVaultData';
import { Colors } from '../theme/colors';
import { VaultCard } from '../types/vault';

export function VaultScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const [cards, setCards] = useState<VaultCard[]>(MOCK_VAULT_CARDS);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);

  const handleAddCard = (newCard: VaultCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent
      />

      <View style={styles.contentContainer}>
        {/* Header with Card Count and AES-256 Badge */}
        <VaultHeader
          cardCount={cards.length}
          onOptionsPress={() => setIsAddCardVisible(true)}
        />

        {/* Vertical Scrollable List of Full Premium Cards */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {cards.map((card) => {
            const gradId = `vaultCardGrad-${card.id}`;
            const formattedLimit = `₹${card.availableLimit.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardContainer,
                  { backgroundColor: card.gradientColors[0] },
                ]}
                onPress={() => navigation.navigate('CardDetail', { card })}
                activeOpacity={0.9}
              >
                {/* SVG Linear Gradient Background */}
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
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
                  <Circle cx="70%" cy="85%" r="50" fill="#FFFFFF" fillOpacity="0.03" />
                </Svg>

                {/* Card Content */}
                <View style={styles.cardInner}>
                  {/* Top Row: Bank Name & Network Logo */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.bankInfoCol}>
                      <Text style={styles.bankNameText}>{card.bank}</Text>
                      <Text style={styles.cardNameText}>{card.name}</Text>
                    </View>

                    <View style={styles.cardTopRight}>
                      <ContactlessIcon size={16} color="rgba(255, 255, 255, 0.75)" />
                      <CardNetworkLogo network={card.network} size={36} />
                    </View>
                  </View>

                  {/* Middle Row: EMV Chip & Reward Pill */}
                  <View style={styles.cardMiddleRow}>
                    <ChipIcon size={26} />

                    <View style={styles.rewardPill}>
                      <RewardStarIcon size={12} color="#FBBF24" />
                      <Text style={styles.rewardPillText} numberOfLines={1}>
                        {card.rewardRate} • {card.bestCategory}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Row: Masked Number, Cardholder & Available Limit */}
                  <View style={styles.cardBottomRow}>
                    <View>
                      <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
                      <Text style={styles.cardholderText}>{card.cardholderName}</Text>
                    </View>

                    <View style={styles.limitCol}>
                      <Text style={styles.limitLabel}>Available</Text>
                      <Text style={styles.limitValue}>{formattedLimit}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Floating Minimalist "+ Add Card" Button (Elevated above bottom tab bar) */}
        <TouchableOpacity
          style={styles.floatingAddBtn}
          onPress={() => setIsAddCardVisible(true)}
          activeOpacity={0.85}
        >
          <PlusIcon size={16} color="#FFFFFF" />
          <Text style={styles.floatingAddText}>Add card</Text>
        </TouchableOpacity>
      </View>

      {/* Add Card Modal */}
      <AddCardModal
        visible={isAddCardVisible}
        onClose={() => setIsAddCardVisible(false)}
        onAddCard={handleAddCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110, // Generous padding so last card is fully visible above floating nav pill
  },
  cardContainer: {
    width: '100%',
    height: 205,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankInfoCol: {
    flex: 1,
    marginRight: 10,
  },
  bankNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardNameText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    maxWidth: '72%',
  },
  rewardPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.8,
    fontVariant: ['tabular-nums'],
  },
  cardholderText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  limitCol: {
    alignItems: 'flex-end',
  },
  limitLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 95, // Above floating bottom pill
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  floatingAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { VaultCard } from '../../types/vault';
import { ChipIcon, ContactlessIcon, RewardStarIcon } from '../icons/VaultIcons';
import { CardNetworkLogo } from './CardNetworkLogo';

type StackedCardItemProps = {
  card: VaultCard;
  index: number;
  totalCards: number;
  onPress: () => void;
  marginTop?: number;
};

export function StackedCardItem({
  card,
  index,
  totalCards,
  onPress,
  marginTop = 0,
}: StackedCardItemProps) {
  const cardHeight = 200;

  const formattedLimit = `₹${card.availableLimit.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const gradId = `stackGrad-${card.id}`;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          height: cardHeight,
          marginTop: marginTop,
          backgroundColor: card.gradientColors[0],
          zIndex: index + 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* 100% Responsive SVG Gradient Background (No fixed width/height clipping) */}
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

        <Rect width="100%" height="100%" rx="16" fill={`url(#${gradId})`} />

        {/* Minimal Glass Circles in background */}
        <Circle cx="85%" cy="70%" r="55" fill="#FFFFFF" fillOpacity="0.04" />
        <Circle cx="70%" cy="85%" r="45" fill="#FFFFFF" fillOpacity="0.03" />
      </Svg>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Top Row: Bank Name & Network Logo */}
        <View style={styles.topRow}>
          <View style={styles.bankCol}>
            <Text style={styles.bankText}>{card.bank}</Text>
            <Text style={styles.cardNameText}>{card.name}</Text>
          </View>

          <View style={styles.topRightRow}>
            <ContactlessIcon size={16} color="rgba(255, 255, 255, 0.7)" />
            <CardNetworkLogo network={card.network} size={32} />
          </View>
        </View>

        {/* Middle Row: Chip & Reward Badge */}
        <View style={styles.middleRow}>
          <ChipIcon size={28} />

          <View style={styles.rewardPill}>
            <RewardStarIcon size={12} color="#FBBF24" />
            <Text style={styles.rewardPillText} numberOfLines={1}>
              {card.rewardRate} • {card.bestCategory}
            </Text>
          </View>
        </View>

        {/* Bottom Row: Number & Balance */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
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
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankCol: {
    flex: 1,
    marginRight: 10,
  },
  bankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardNameText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumber: {
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
    letterSpacing: 0.8,
  },
  limitCol: {
    alignItems: 'flex-end',
  },
  limitLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limitValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
});

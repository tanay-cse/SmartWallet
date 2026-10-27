import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { VaultCard } from '../../types/vault';
import {
  ArrowLeftIcon,
  ChipIcon,
  ContactlessIcon,
  CopyIcon,
  LockIcon,
  RewardStarIcon,
  SparklesIcon,
  UnlockIcon,
} from '../icons/VaultIcons';
import { CheckIcon, ShieldCheckIcon } from '../icons/BudgetIcons';
import { CardNetworkLogo } from './CardNetworkLogo';

type CardDetailViewProps = {
  card: VaultCard;
  onBack: () => void;
  onDeleteCard?: (id: string) => void;
};

export function CardDetailView({
  card,
  onBack,
  onDeleteCard,
}: CardDetailViewProps) {
  const [isLocked, setIsLocked] = useState(card.isLocked || false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const formattedBalance = `₹${card.availableLimit.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedLimit = `₹${card.balanceOrLimit.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const usedAmount = Math.max(0, card.balanceOrLimit - card.availableLimit);
  const percentUsed = Math.round((usedAmount / card.balanceOrLimit) * 100);

  const handleCopy = () => {
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const gradId = `detailGrad-${card.id}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Back Navigation Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>All Cards</Text>
        </TouchableOpacity>

        <View style={styles.cardTypeBadge}>
          <Text style={styles.cardTypeText}>{card.cardType.toUpperCase()}</Text>
        </View>
      </View>

      {/* Expanded Hero Card Graphic (Clean 100% SVG, NO background placeholder box, NO blurry shadow) */}
      <View
        style={[
          styles.heroCardContainer,
          { backgroundColor: card.gradientColors[0] },
        ]}
      >
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

          <Rect width="100%" height="100%" rx="16" fill={`url(#${gradId})`} />

          {/* Clean Glass Circles */}
          <Circle cx="85%" cy="65%" r="60" fill="#FFFFFF" fillOpacity="0.05" />
          <Circle cx="70%" cy="80%" r="50" fill="#FFFFFF" fillOpacity="0.04" />
          <Circle cx="90%" cy="30%" r="45" fill="#FFFFFF" fillOpacity="0.03" />
        </Svg>

        <View style={styles.heroCardContent}>
          {/* Top Row: Balance & Network Logo */}
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroBalanceLabel}>Balance / Limit</Text>
              <Text style={styles.heroBalanceAmount}>{formattedBalance}</Text>
            </View>

            <CardNetworkLogo network={card.network} size={38} />
          </View>

          {/* Middle Row: EMV Chip & Contactless wave */}
          <View style={styles.heroMiddleRow}>
            <ChipIcon size={32} />
            <ContactlessIcon size={18} color="rgba(255, 255, 255, 0.8)" />
          </View>

          {/* Bottom Row: Masked Number & Expired Date */}
          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.heroCardNumber}>•••• •••• •••• {card.last4}</Text>
              <Text style={styles.heroCardholder}>{card.cardholderName}</Text>
            </View>

            <View style={styles.heroExpiryCol}>
              <Text style={styles.heroExpiryLabel}>Expires</Text>
              <Text style={styles.heroExpiryValue}>{card.expiryDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Prominent Core SRS Feature: AI Spend Recommendation */}
      <View style={styles.rewardBanner}>
        <View style={styles.rewardHeaderRow}>
          <View style={styles.rewardIconBadge}>
            <SparklesIcon size={18} color={Colors.forestGreen} />
          </View>
          <View style={styles.rewardTitleCol}>
            <Text style={styles.rewardTag}>AI SPEND RECOMMENDATION</Text>
            <Text style={styles.rewardMainHeading}>
              {card.rewardRate} on {card.bestCategory}
            </Text>
          </View>
        </View>

        <Text style={styles.rewardDescription}>
          SmartWallet AI attaches this card automatically whenever spending on{' '}
          <Text style={styles.highlightText}>{card.bestCategory}</Text> to
          maximize your net cashback.
        </Text>

        <View style={styles.baseRateRow}>
          <Text style={styles.baseRateLabel}>Base Return Rate:</Text>
          <Text style={styles.baseRateValue}>{card.baseRewardRate}</Text>
        </View>
      </View>

      {/* Credit Utilization / Balance Health */}
      <View style={styles.limitCard}>
        <View style={styles.limitHeader}>
          <Text style={styles.sectionHeading}>Credit Line & Utilization</Text>
          <Text style={styles.percentText}>{percentUsed}% used</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, percentUsed)}%`,
                backgroundColor:
                  percentUsed > 75 ? Colors.warning : Colors.forestGreen,
              },
            ]}
          />
        </View>

        <View style={styles.limitStatsRow}>
          <View>
            <Text style={styles.limitStatLabel}>Used This Month</Text>
            <Text style={styles.limitStatValue}>
              ₹{usedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.limitStatLabel}>Total Credit Limit</Text>
            <Text style={styles.limitStatValue}>{formattedLimit}</Text>
          </View>
        </View>
      </View>

      {/* Card Benefits & Attached Reward Rules (SRS FR-2) */}
      <View style={styles.perksSection}>
        <Text style={styles.sectionHeading}>Attached Reward Rules & Perks</Text>

        <View style={styles.perksList}>
          {card.perks.map((perk) => (
            <View key={perk.id} style={styles.perkItem}>
              <View style={styles.perkIconCircle}>
                <RewardStarIcon size={16} color={Colors.forestGreen} />
              </View>
              <View style={styles.perkTextCol}>
                <View style={styles.perkTitleRow}>
                  <Text style={styles.perkTitle}>{perk.title}</Text>
                  {perk.tag && (
                    <View style={styles.perkTag}>
                      <Text style={styles.perkTagText}>{perk.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.perkDesc}>{perk.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Card Quick Controls & Security Actions */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionHeading}>Card Security & Controls</Text>

        <View style={styles.controlsRow}>
          {/* Copy Card Details */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <View style={styles.controlIconCircle}>
              {copiedNumber ? (
                <CheckIcon size={16} color={Colors.forestGreen} />
              ) : (
                <CopyIcon size={16} color={Colors.textPrimary} />
              )}
            </View>
            <Text style={styles.controlLabel}>
              {copiedNumber ? 'Copied!' : 'Copy Number'}
            </Text>
          </TouchableOpacity>

          {/* Lock / Freeze Card Toggle */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setIsLocked(!isLocked)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.controlIconCircle,
                isLocked && styles.controlIconLocked,
              ]}
            >
              {isLocked ? (
                <UnlockIcon size={16} color={Colors.forestGreen} />
              ) : (
                <LockIcon size={16} color={Colors.textPrimary} />
              )}
            </View>
            <Text style={styles.controlLabel}>
              {isLocked ? 'Unlock Card' : 'Freeze Card'}
            </Text>
          </TouchableOpacity>

          {/* Security Info */}
          <View style={styles.controlBtn}>
            <View style={styles.controlIconCircle}>
              <ShieldCheckIcon size={16} color={Colors.forestGreen} />
            </View>
            <Text style={styles.controlLabel}>Tokenized</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardTypeBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  heroCardContainer: {
    width: '100%',
    height: 205,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroCardContent: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroBalanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },
  heroBalanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroCardNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  heroCardholder: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 3,
    letterSpacing: 0.8,
  },
  heroExpiryCol: {
    alignItems: 'flex-end',
  },
  heroExpiryLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroExpiryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  rewardBanner: {
    backgroundColor: Colors.forestGreenLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rewardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  rewardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTitleCol: {
    flex: 1,
  },
  rewardTag: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.forestGreen,
    letterSpacing: 0.8,
  },
  rewardMainHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.forestGreenDark,
    marginTop: 1,
  },
  rewardDescription: {
    fontSize: 12,
    color: Colors.slateExpense,
    lineHeight: 18,
    marginTop: 4,
  },
  highlightText: {
    fontWeight: '700',
    color: Colors.forestGreenDark,
  },
  baseRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(6, 95, 70, 0.12)',
  },
  baseRateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  baseRateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.forestGreenDark,
  },
  limitCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  limitStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitStatLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  limitStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  perksSection: {
    marginBottom: 16,
  },
  perksList: {
    marginTop: 8,
    gap: 8,
  },
  perkItem: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  perkIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  perkTextCol: {
    flex: 1,
  },
  perkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perkTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  perkTag: {
    backgroundColor: Colors.forestGreenLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  perkTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  perkDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  controlsSection: {
    marginBottom: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  controlIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIconLocked: {
    backgroundColor: Colors.forestGreenLight,
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

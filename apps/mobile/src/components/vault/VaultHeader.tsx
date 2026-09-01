import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { ShieldCheckIcon, ThreeDotsIcon } from '../icons/BudgetIcons';

type VaultHeaderProps = {
  cardCount: number;
  onOptionsPress?: () => void;
};

export function VaultHeader({ cardCount, onOptionsPress }: VaultHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Cards</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{cardCount} active</Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          <View style={styles.encryptedPill}>
            <ShieldCheckIcon size={13} color={Colors.forestGreen} />
            <Text style={styles.encryptedText}>AES-256 Vault</Text>
          </View>

          <TouchableOpacity
            style={styles.optionsBtn}
            onPress={onOptionsPress}
            activeOpacity={0.7}
          >
            <ThreeDotsIcon size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  countBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  encryptedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.forestGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  encryptedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  optionsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

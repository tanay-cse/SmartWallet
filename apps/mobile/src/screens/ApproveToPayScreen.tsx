import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { Colors } from '../theme/colors';

type TabMode = 'pending' | 'completed';

// Custom Scenic Vector Illustration matching User Screenshots
function ScenicApprovalIllustration({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.75} viewBox="0 0 200 150" fill="none">
      {/* Soft Cloud */}
      <Path
        d="M140 32C140 28 143 25 147 25C148.5 25 149.8 25.5 150.8 26.4C151.8 24.4 153.8 23 156.2 23C159.5 23 162.2 25.4 162.5 28.5C163.6 28.2 164.8 28.5 165.6 29.3C166.5 30.1 167 31.3 167 32.5C167 34.4 165.4 36 163.5 36H144C141.8 36 140 34.2 140 32Z"
        fill="#CBD5E1"
      />

      {/* Tree Canopy (Warm Amber & Olive Golden Tones) */}
      <Circle cx="120" cy="50" r="18" fill="#D97706" />
      <Circle cx="132" cy="44" r="16" fill="#F59E0B" />
      <Circle cx="108" cy="56" r="14" fill="#B45309" />
      <Circle cx="128" cy="60" r="14" fill="#D97706" />

      {/* Tree Trunk */}
      <Rect x="122" y="66" width="5" height="30" rx="1.5" fill="#78350F" />
      <Path d="M124.5 76L134 68" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Bushes */}
      <Circle cx="90" cy="92" r="12" fill="#065F46" />
      <Circle cx="106" cy="90" r="14" fill="#047857" />
      <Circle cx="120" cy="94" r="11" fill="#065F46" />
      <Circle cx="140" cy="92" r="12" fill="#044E37" />

      {/* Parking Sign Pole & Plaque */}
      <Rect x="88" y="58" width="2.5" height="38" fill="#64748B" />
      <Rect x="83" y="48" width="13" height="13" rx="2.5" fill="#6366F1" />
      <SvgText x="89.5" y="58" fontSize="9" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">P</SvgText>

      {/* Road / Curved Ground Line */}
      <Path
        d="M72 96H150C152 96 154 98 154 100V100C154 102 152 104 150 104H88C82 104 78 100 78 94V88"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Safety Traffic Cone */}
      <Polygon points="75,98 81,98 79,88 77,88" fill="#EA580C" />
      <Rect x="73.5" y="98" width="9" height="2" rx="0.5" fill="#EA580C" />
      <Path d="M76.5 94H79.5" stroke="#FFFFFF" strokeWidth="1.2" />
    </Svg>
  );
}

export function ApproveToPayScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabMode>('pending');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

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

        <Text style={styles.headerTitle}>Approve to Pay</Text>

        <View style={{ width: 38 }} />
      </View>

      {/* ==================== TABS SEGMENT ==================== */}
      <View style={styles.tabsContainer}>
        {/* Pending Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('pending')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Pending
          </Text>
          {activeTab === 'pending' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Completed Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('completed')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Completed
          </Text>
          {activeTab === 'completed' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* ==================== TAB CONTENT ==================== */}
      <View style={styles.contentContainer}>
        {activeTab === 'pending' ? (
          /* PENDING STATE */
          <View style={styles.centerBox}>
            <View style={styles.illustrationWrapper}>
              <ScenicApprovalIllustration size={220} />
            </View>

            <Text style={styles.headlineText}>Yay!</Text>
            <Text style={styles.subText}>No Pending Transactions</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>UPI Mandates & Autopay</Text>
              <Text style={styles.infoCardDesc}>
                Any pending merchant payment approval requests or subscription debits will appear here for 1-tap PIN verification.
              </Text>
            </View>
          </View>
        ) : (
          /* COMPLETED STATE */
          <View style={styles.centerBox}>
            <View style={styles.illustrationWrapper}>
              <ScenicApprovalIllustration size={220} />
            </View>

            <Text style={styles.headlineText}>None completed yet!</Text>
            <Text style={styles.subText}>Your approved transaction history will show up here.</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Auto-Settled Mandates</Text>
              <Text style={styles.infoCardDesc}>
                Past approved UPI Circle transfers, recurring bill payments, and standing orders will be archived here.
              </Text>
            </View>
          </View>
        )}
      </View>
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingTop: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  tabTextActive: {
    color: Colors.forestGreen,
  },
  tabTextInactive: {
    color: Colors.textSecondary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: Colors.forestGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustrationWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '100%',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

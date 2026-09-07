import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

// Bank FASTag Provider Logo
function FastagProviderLogo({ bank, size = 42 }: { bank: 'sbi' | 'airtel' | 'hdfc' | 'icici'; size?: number }) {
  if (bank === 'sbi') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#0284C7" />
        <Circle cx="20" cy="20" r="12" fill="#FFFFFF" />
        <Circle cx="20" cy="20" r="7" fill="#0284C7" />
        <Rect x="18.5" y="20" width="3" height="9" fill="#FFFFFF" />
      </Svg>
    );
  }
  if (bank === 'airtel') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="10" fill="#EF4444" />
        <Circle cx="20" cy="20" r="12" fill="#FFFFFF" />
        <SvgText x="20" y="25" fontSize="12" fontWeight="900" fill="#EF4444" textAnchor="middle">₹</SvgText>
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="10" fill="#1E3A8A" />
      <Rect x="8" y="8" width="24" height="24" rx="4" fill="#FFFFFF" />
      <Rect x="14" y="14" width="12" height="12" fill="#1E3A8A" />
    </Svg>
  );
}

type FastagAccount = {
  id: string;
  provider: string;
  bankKey: 'sbi' | 'airtel' | 'hdfc' | 'icici';
  vehicleNumber: string;
  lastRechargeInfo?: string;
};

const MOCK_FASTAGS: FastagAccount[] = [
  {
    id: 'f1',
    provider: 'State Bank of India (SBI) - NETC FASTag',
    bankKey: 'sbi',
    vehicleNumber: 'RJ40CA4433',
    lastRechargeInfo: 'Recharge of ₹400 on 16 Aug 2026',
  },
  {
    id: 'f2',
    provider: 'Airtel Payments Bank NETC FASTag',
    bankKey: 'airtel',
    vehicleNumber: 'RJ40CA4433',
  },
];

export function FastagRechargeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleRechargeFastag = (item: FastagAccount) => {
    Alert.alert(
      `Recharge ${item.vehicleNumber}`,
      `Provider: ${item.provider}\nEnter recharge amount (e.g. ₹500, ₹1000):`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Pay',
          style: 'default',
          onPress: () => {
            Alert.alert('FASTag Recharge', 'Connecting with NETC toll switch for instant balance top-up...');
          },
        },
      ]
    );
  };

  const handleAddNewVehicle = () => {
    Alert.prompt
      ? Alert.prompt(
          'Add Vehicle FASTag',
          'Enter vehicle registration number (e.g. RJ40CA4433):',
          (text) => {
            if (text) {
              Alert.alert('Vehicle Added', `Fetching FASTag provider for ${text.toUpperCase()}...`);
            }
          }
        )
      : Alert.alert('Add Vehicle', 'Enter vehicle registration number to link NETC FASTag.');
  };

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

        <Text style={styles.headerTitle}>FASTag Recharge</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('FASTag Help', 'Recharge any NETC FASTag nationwide with instant toll booth sync.');
          }}
          activeOpacity={0.7}
        >
          <QuestionHelpIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your FASTags</Text>
        </View>

        {/* FASTag Accounts List */}
        <View style={styles.cardContainer}>
          {MOCK_FASTAGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.fastagCard}
              onPress={() => handleRechargeFastag(item)}
              activeOpacity={0.8}
            >
              <FastagProviderLogo bank={item.bankKey} size={42} />

              <View style={styles.fastagDetails}>
                <Text style={styles.providerName} numberOfLines={1}>{item.provider}</Text>
                <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
                {item.lastRechargeInfo ? (
                  <Text style={styles.lastRechargeText}>{item.lastRechargeInfo}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.dotsMenuBtn}
                onPress={() => Alert.alert(item.vehicleNumber, `Manage ${item.provider}`)}
              >
                <Text style={styles.dotsText}>⋮</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ==================== BOTTOM ACTION ==================== */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={styles.addVehicleBtn}
          onPress={handleAddNewVehicle}
          activeOpacity={0.85}
        >
          <Text style={styles.addVehicleText}>Add New Vehicle</Text>
        </TouchableOpacity>

        <View style={styles.bharatConnectBadge}>
          <Text style={styles.poweredByText}>Powered by </Text>
          <Text style={styles.bharatConnectBold}>Bharat Connect</Text>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardContainer: {
    gap: 10,
  },
  fastagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  fastagDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  vehicleNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  lastRechargeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  dotsMenuBtn: {
    padding: 8,
  },
  dotsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  addVehicleBtn: {
    width: '100%',
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addVehicleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bharatConnectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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

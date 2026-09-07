import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRightIcon } from '../components/icons/BudgetIcons';
import {
  BankBuildingIcon,
  ChevronLeftIcon,
  CopyIcon,
  CreditCardPlusIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FlashZapIcon,
  ShareIcon,
  SyncIcon,
} from '../components/icons/TabIcon';
import { Colors } from '../theme/colors';

export function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isUpiHidden, setIsUpiHidden] = useState(false);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  // Smooth 60fps Native Scroll Animation for QR card
  const scrollY = useRef(new Animated.Value(0)).current;

  const qrScale = scrollY.interpolate({
    inputRange: [-60, 0, 150],
    outputRange: [1.05, 1, 0.94],
    extrapolate: 'clamp',
  });

  const qrOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });

  const menuItems = [
    { id: 'cashback', title: 'Cashback', subtitle: 'View earned rewards' },
    { id: 'settings', title: 'Settings', subtitle: 'Security & preferences' },
    { id: 'support', title: 'Help & Support', subtitle: '24/7 priority care' },
    { id: 'about', title: 'About Us', subtitle: 'Terms & legal' },
    { id: 'contact', title: 'Contact Us', subtitle: 'Get in touch' },
    { id: 'logout', title: 'Logout', isDestructive: true },
  ];

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerProfileInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>C</Text>
          </View>
          <Text style={styles.headerUserName}>Chirag</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

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
        {/* ==================== UPI QR CODE CARD ==================== */}
        <Animated.View
          style={[
            styles.qrCardContainer,
            {
              transform: [{ scale: qrScale }],
              opacity: qrOpacity,
            },
          ]}
        >
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

          {/* High-Resolution Crystal Clear Real QR Code Image */}
          <View style={styles.qrCodeCenter}>
            <Image
              source={require('../../assets/real-qr-code.png')}
              style={styles.realQrImage}
              resizeMode="contain"
            />
          </View>

          {/* Bottom link: Your QR */}
          <View style={styles.yourQrRow}>
            <Text style={styles.yourQrText}>Your QR</Text>
            <ChevronRightIcon size={14} color="#FFFFFF" />
          </View>

          {/* Action buttons: Download & Share */}
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
        </Animated.View>

        {/* ==================== PAYMENT METHODS SECTION ==================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
          </View>

          <View style={styles.paymentMethodsGrid}>
            {/* Bank Accounts */}
            <View style={styles.methodCard}>
              <View style={styles.methodIconCircle}>
                <BankBuildingIcon size={20} color={Colors.textPrimary} />
              </View>
              <Text style={styles.methodTitle}>Bank Accounts</Text>
              <Text style={styles.methodSubtitle}>1 added</Text>
            </View>

            {/* Credit Card */}
            <View style={styles.methodCard}>
              <View style={styles.methodIconCircle}>
                <CreditCardPlusIcon size={20} color={Colors.textPrimary} />
              </View>
              <Text style={styles.methodTitle}>Credit Card</Text>
              <Text style={styles.methodSubtitle}>0 added</Text>
            </View>

            {/* Autopay (Renamed from Biometric Pay) */}
            <View style={styles.methodCard}>
              <View style={[styles.methodIconCircle, styles.methodIconActive]}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
                <SyncIcon size={20} color={Colors.forestGreen} />
              </View>
              <Text style={styles.methodTitle}>Autopay</Text>
              <Text style={styles.methodActivateText}>Activate</Text>
            </View>

            {/* UPI Lite */}
            <View style={styles.methodCard}>
              <View style={styles.methodIconCircle}>
                <FlashZapIcon size={20} color={Colors.textPrimary} />
              </View>
              <Text style={styles.methodTitle}>UPI Lite</Text>
              <Text style={styles.methodSubtitle}>0 added</Text>
            </View>
          </View>
        </View>

        {/* ==================== SETTINGS & OPTIONS LIST ==================== */}
        <View style={styles.menuListContainer}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            return (
              <View
                key={item.id}
                style={[styles.menuRow, !isLast && styles.menuRowBorder]}
              >
                <Text
                  style={[
                    styles.menuTitle,
                    item.isDestructive && styles.menuTitleDestructive,
                  ]}
                >
                  {item.title}
                </Text>
                <ChevronRightIcon size={14} color={Colors.textMuted} />
              </View>
            );
          })}
        </View>

        {/* ==================== FOOTER ==================== */}
        <View style={styles.footerContainer}>
          <Image
            source={require('../../assets/sw-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerVersionText}>SmartWallet • Version 4.0.21</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  qrCardContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
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
    paddingHorizontal: 8,
    marginBottom: 16,
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
    borderRadius: 16,
  },
  realQrImage: {
    width: 250,
    height: 250,
  },
  yourQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    marginBottom: 16,
  },
  yourQrText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 14,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  methodCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  methodIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  methodIconActive: {
    borderWidth: 1.5,
    borderColor: Colors.forestGreen,
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  methodTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  methodSubtitle: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  methodActivateText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.forestGreen,
    marginTop: 2,
  },
  menuListContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuTitleDestructive: {
    color: '#DC2626',
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingBottom: 40,
  },
  footerLogo: {
    width: 80,
    height: 34,
    alignSelf: 'center',
    marginBottom: 6,
  },
  footerVersionText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});

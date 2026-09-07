import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusIcon } from '../components/icons/BudgetIcons';
import { ChevronLeftIcon, SyncIcon } from '../components/icons/TabIcon';
import { QuestionHelpIcon, SearchHeaderIcon } from '../components/pay/PayIcons';
import { Colors } from '../theme/colors';

type ContactPayment = {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  subtext: string;
  amount: string;
  isReceived: boolean;
  date: string;
  isActive: boolean;
  phone?: string;
  upiId?: string;
};

const MOCK_CONTACTS: ContactPayment[] = [
  {
    id: '1',
    name: 'Etika',
    initials: 'E',
    avatarBg: '#3B82F6',
    subtext: 'Received Instantly',
    amount: '₹2,000',
    isReceived: true,
    date: '22/08',
    isActive: true,
    phone: '+91 98765 43210',
    upiId: 'etika@oksbi',
  },
  {
    id: '2',
    name: 'Ram',
    initials: 'R',
    avatarBg: '#065F46',
    subtext: 'Received Instantly',
    amount: '₹69.69',
    isReceived: true,
    date: '02/08',
    isActive: true,
    phone: '+91 98111 22334',
    upiId: 'ram.sharma@paytm',
  },
  {
    id: '3',
    name: 'Maa Home',
    initials: 'MH',
    avatarBg: '#059669',
    subtext: 'Received Instantly',
    amount: '₹3,000',
    isReceived: true,
    date: '27/07',
    isActive: true,
    phone: '+91 94123 45678',
    upiId: 'maa.home@okaxis',
  },
  {
    id: '4',
    name: 'Naman 113',
    initials: 'N1',
    avatarBg: '#1E3A8A',
    subtext: 'Received Instantly',
    amount: '₹25',
    isReceived: true,
    date: '16/04',
    isActive: true,
    phone: '+91 99887 76655',
    upiId: 'naman113@ybl',
  },
  {
    id: '5',
    name: 'Ali Ekram',
    initials: 'AE',
    avatarBg: '#D97706',
    subtext: 'Received Instantly',
    amount: '₹35',
    isReceived: true,
    date: '15/04',
    isActive: true,
    phone: '+91 97654 32109',
    upiId: 'aliekram@ibl',
  },
  {
    id: '6',
    name: 'Pranav Tiwari',
    initials: 'PT',
    avatarBg: '#0F766E',
    subtext: 'Sent Securely',
    amount: 'You : ₹20',
    isReceived: false,
    date: '08/04',
    isActive: true,
    phone: '+91 91234 56780',
    upiId: 'ptiwari@okhdfcbank',
  },
  {
    id: '7',
    name: 'PRANJULYA KUMAR',
    initials: 'PK',
    avatarBg: '#334155',
    subtext: 'Received Instantly',
    amount: '₹2,000',
    isReceived: true,
    date: '05/04',
    isActive: true,
    phone: '+91 98712 34567',
    upiId: 'pranjulya@icici',
  },
  {
    id: '8',
    name: 'Bhavesh',
    initials: 'B',
    avatarBg: '#1E293B',
    subtext: 'Received Instantly',
    amount: '₹1',
    isReceived: true,
    date: '02/02',
    isActive: true,
    phone: '+91 93456 78901',
    upiId: 'bhavesh@oksbi',
  },
  {
    id: '9',
    name: 'Mahesh Ydv GGSSST',
    initials: 'MY',
    avatarBg: '#044E37',
    subtext: 'Received Instantly',
    amount: '₹4,000',
    isReceived: true,
    date: '29/01',
    isActive: true,
    phone: '+91 92345 67890',
    upiId: 'maheshydv@paytm',
  },
  {
    id: '10',
    name: 'Era Di',
    initials: 'ED',
    avatarBg: '#475569',
    subtext: 'Received Instantly',
    amount: '₹100',
    isReceived: true,
    date: '12/01',
    isActive: true,
    phone: '+91 91098 76543',
    upiId: 'eradi@axl',
  },
];

export function SendMoneyScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CONTACTS;
    const q = searchQuery.toLowerCase().trim();
    return MOCK_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.upiId?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleContactPress = (contact: ContactPayment) => {
    Alert.alert(
      `Pay ${contact.name}`,
      `UPI ID: ${contact.upiId || 'Linked to mobile'}\nPhone: ${contact.phone || 'N/A'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Money',
          style: 'default',
          onPress: () => {
            Alert.alert('Payment Initiated', `Opening transfer window for ${contact.name}...`);
          },
        },
      ]
    );
  };

  const handleNewPayment = () => {
    Alert.prompt
      ? Alert.prompt(
          'New Payment',
          'Enter recipient mobile number or UPI ID:',
          (text) => {
            if (text) {
              Alert.alert('Proceeding', `Initiating payment to ${text}`);
            }
          }
        )
      : Alert.alert('New Payment', 'Enter mobile number or UPI ID to initiate transfer.');
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

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={styles.upiBadgesRow}>
            <Text style={styles.upiSubText}>to any UPI app</Text>
            <View style={styles.badgeMiniPill}>
              <Text style={styles.badgeMiniText}>PhonePe</Text>
            </View>
            <View style={styles.badgeMiniPill}>
              <Text style={styles.badgeMiniText}>BHIM</Text>
            </View>
            <View style={styles.badgeMiniPill}>
              <Text style={styles.badgeMiniText}>GPay</Text>
            </View>
            <View style={styles.badgeMiniPill}>
              <Text style={styles.badgeMiniText}>Paytm</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Alert.alert('Sync Contacts', 'Contact list synced with phonebook & UPI directory.');
            }}
            activeOpacity={0.7}
          >
            <SyncIcon size={18} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Alert.alert('Send Money Help', 'Send money directly to any mobile number or UPI ID instantly 24x7 with ₹0 fees.');
            }}
            activeOpacity={0.7}
          >
            <QuestionHelpIcon size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================== SEARCH BAR ==================== */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <SearchHeaderIcon size={18} color={Colors.forestGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search any mobile number or name"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="default"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ==================== LIST SECTION ==================== */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.listSectionTitle}>PAYMENTS & CHAT</Text>
        <Text style={styles.listCountText}>{filteredContacts.length} contacts</Text>
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handleContactPress(item)}
            activeOpacity={0.75}
          >
            {/* Avatar with UPI badge */}
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, { backgroundColor: item.avatarBg }]}>
                <Text style={styles.avatarInitials}>{item.initials}</Text>
              </View>
              <View style={styles.upiBadge}>
                <Text style={styles.upiBadgeText}>UPI</Text>
              </View>
            </View>

            {/* Name & Amount subtext */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <View style={styles.subtextRow}>
                <Text
                  style={[
                    styles.amountText,
                    item.isReceived ? styles.amountReceived : styles.amountSent,
                  ]}
                >
                  {item.amount}
                </Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.statusSubtext}>{item.subtext}</Text>
              </View>
            </View>

            {/* Date & Active status dot */}
            <View style={styles.contactMeta}>
              <Text style={styles.dateText}>{item.date}</Text>
              {item.isActive && <View style={styles.activeGreenDot} />}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ==================== FLOATING NEW PAYMENT BUTTON ==================== */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingNewPayBtn}
          onPress={handleNewPayment}
          activeOpacity={0.88}
        >
          <PlusIcon size={18} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>New Payment</Text>
        </TouchableOpacity>
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
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  upiBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  upiSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  badgeMiniPill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeMiniText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  listSectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  listCountText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Room for floating button
  },
  itemSeparator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 66,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  upiBadge: {
    position: 'absolute',
    bottom: -3,
    left: '50%',
    transform: [{ translateX: -14 }],
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    borderRadius: 4,
  },
  upiBadgeText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: Colors.forestGreen,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amountText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  amountReceived: {
    color: Colors.forestGreenDark,
  },
  amountSent: {
    color: Colors.slateExpense,
  },
  dotSeparator: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  statusSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contactMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  activeGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    zIndex: 99,
  },
  floatingNewPayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

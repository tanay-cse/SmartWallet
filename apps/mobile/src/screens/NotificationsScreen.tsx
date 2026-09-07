import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellIcon, ChevronLeftIcon } from '../components/icons/TabIcon';
import { Colors } from '../theme/colors';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  type: 'reward' | 'transaction' | 'budget' | 'security';
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Travel Reward Points',
    message: 'Alert: Your 10X Travel Reward points are expiring soon! Redeem them for flights or hotel stays.',
    time: '10m ago',
    isUnread: true,
    type: 'reward',
  },
  {
    id: 'n2',
    title: 'Salary Deposit Credited',
    message: '₹55,000.00 from Corporate Direct Deposit was credited to your Primary Account.',
    time: '2h ago',
    isUnread: true,
    type: 'transaction',
  },
  {
    id: 'n3',
    title: 'Budget Alert (88% Reached)',
    message: 'You have spent ₹12,460.00 of your ₹14,000.00 Meals & Dining limit for March.',
    time: 'Yesterday',
    isUnread: false,
    type: 'budget',
  },
  {
    id: 'n4',
    title: 'Emergency Vault Interest',
    message: '₹750.00 monthly interest (7.2% APY) has been credited to your Emergency Vault.',
    time: '2 days ago',
    isUnread: false,
    type: 'reward',
  },
  {
    id: 'n5',
    title: 'Security Login',
    message: 'New login detected on your SmartWallet iOS app. If this wasn’t you, lock your vault immediately.',
    time: '3 days ago',
    isUnread: false,
    type: 'security',
  },
];

export function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listWrapper}>
          {MOCK_NOTIFICATIONS.map((item, index) => {
            const isLast = index === MOCK_NOTIFICATIONS.length - 1;

            return (
              <View
                key={item.id}
                style={[
                  styles.notificationRow,
                  item.isUnread && styles.notificationRowUnread,
                  !isLast && styles.notificationBorder,
                ]}
              >
                {/* Unread indicator dot */}
                <View style={styles.indicatorContainer}>
                  {item.isUnread ? (
                    <View style={styles.greenDot} />
                  ) : (
                    <View style={styles.emptyDot} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.itemMessage}>{item.message}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  listWrapper: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: 12,
  },
  notificationRowUnread: {
    backgroundColor: 'transparent',
  },
  notificationBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  indicatorContainer: {
    paddingTop: 5,
  },
  greenDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.forestGreen,
  },
  emptyDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: 'transparent',
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  itemMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

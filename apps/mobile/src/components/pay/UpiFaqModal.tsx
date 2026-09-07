import React, { useState } from 'react';
import {
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
import { ChevronRightIcon } from '../icons/BudgetIcons';
import { ChevronLeftIcon } from '../icons/TabIcon';
import { SearchHeaderIcon } from './PayIcons';
import { Colors } from '../../theme/colors';

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'What is UPI and how does SmartWallet work?',
    answer:
      'UPI (Unified Payments Interface) is an instant real-time payment system developed by NPCI. SmartWallet securely connects to your bank accounts to enable instant 24/7 bank-to-bank transfers, QR code payments, bill recharges, and automated investments.',
  },
  {
    id: '2',
    category: 'UPI Circle',
    question: 'What is UPI Circle and how do I add trusted delegates?',
    answer:
      'UPI Circle allows you (primary account holder) to authorize secondary users (such as family members or dependents) to initiate payments from your bank account either with your per-transaction approval or up to a pre-approved monthly spending limit.',
  },
  {
    id: '3',
    category: 'Limits',
    question: 'What are the daily transaction limits for UPI?',
    answer:
      'As per NPCI guidelines: The standard UPI limit is up to ₹1,00,000 per day. For verified educational and healthcare institutions, the limit is up to ₹5,00,000 per day. UPI Lite allows instantaneous PIN-less payments up to ₹500 per transaction (₹4,000 wallet limit).',
  },
  {
    id: '4',
    category: 'Failed Transactions',
    question: 'Money was deducted from my bank but receiver did not get it?',
    answer:
      'Do not worry! Bank debits during network timeouts are protected by NPCI auto-settlement. 98% of pending transactions are either resolved within 2 hours or automatically reversed back to your source bank account within T+1 working days.',
  },
  {
    id: '5',
    category: 'Security & PIN',
    question: 'How do I reset or change my 4/6 digit UPI PIN?',
    answer:
      'Navigate to Profile > Bank Accounts > Select your Bank > Tap "Change UPI PIN". You will need your Debit Card last 6 digits and expiry date, or your registered Aadhaar number with OTP verification.',
  },
  {
    id: '6',
    category: 'Autopay & Mandates',
    question: 'How does UPI Autopay work for recurring bills & SIPs?',
    answer:
      'UPI Autopay enables automatic periodic payments for electricity, broadband, mutual fund SIPs, and OTT subscriptions. You set the debit date and cap limit once with your UPI PIN, and subsequent cycles are debited automatically without manual intervention.',
  },
  {
    id: '7',
    category: 'Security',
    question: 'Is SmartWallet secure and encrypted?',
    answer:
      'Yes. SmartWallet uses bank-grade AES-256 encryption, zero-knowledge biometric authentication (FaceID/Fingerprint), device binding, and tokenization compliant with RBI and NPCI cybersecurity frameworks.',
  },
];

type UpiFaqModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function UpiFaqModal({ visible, onClose }: UpiFaqModalProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />

        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <ChevronLeftIcon size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>UPI Help & FAQs</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <SearchHeaderIcon size={18} color={Colors.forestGreen} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search UPI queries, limits, refunds..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ List */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionSubtitle}>
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Answer found' : 'Answers found'}
          </Text>

          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleExpand(faq.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{faq.category.toUpperCase()}</Text>
                  </View>
                  <View style={styles.questionRow}>
                    <Text style={styles.questionText}>{faq.question}</Text>
                    <View style={[styles.arrowCircle, isExpanded && styles.arrowCircleExpanded]}>
                      <ChevronRightIcon size={14} color={isExpanded ? Colors.forestGreen : Colors.textMuted} />
                    </View>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Contact Support Footer */}
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Still need assistance?</Text>
            <Text style={styles.supportDesc}>
              SmartWallet 24x7 resolution desk is available for instant dispute settlement and priority care.
            </Text>
            <TouchableOpacity style={styles.contactBtn} activeOpacity={0.85}>
              <Text style={styles.contactBtnText}>Contact 24x7 Helpdesk</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Crisp white
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  faqHeader: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.forestGreenDark,
    letterSpacing: 0.6,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircleExpanded: {
    transform: [{ rotate: '90deg' }],
    backgroundColor: Colors.forestGreenLight,
    borderColor: Colors.forestGreenBorder,
  },
  answerBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  answerText: {
    fontSize: 13.5,
    color: Colors.slateLight,
    lineHeight: 21,
  },
  supportCard: {
    backgroundColor: Colors.forestGreenLight,
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    alignItems: 'center',
    textAlign: 'center',
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.forestGreenDark,
    marginBottom: 6,
  },
  supportDesc: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  contactBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

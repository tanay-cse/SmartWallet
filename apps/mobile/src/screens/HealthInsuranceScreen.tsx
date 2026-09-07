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

const HEALTH_PARTNERS = [
  'ADITYA BIRLA',
  'BAJAJ ALLIANZ',
  'CARE HEALTH',
  'DIGIT',
  'HDFC ERGO',
  'STAR HEALTH',
];

type FamilyMember = {
  id: string;
  label: string;
  emoji: string;
};

const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'myself', label: 'Myself', emoji: '🧑' },
  { id: 'spouse', label: 'Spouse', emoji: '👩‍❤️‍👨' },
  { id: 'children', label: 'Children', emoji: '👶' },
  { id: 'parents', label: 'Parents/In-laws', emoji: '👵' },
];

export function HealthInsuranceScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['myself']);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      if (selectedMembers.length === 1) {
        Alert.alert('Selection Required', 'Please select at least one family member to insure.');
        return;
      }
      setSelectedMembers(selectedMembers.filter((m) => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleFindHealthPlans = () => {
    const names = selectedMembers.map((id) => FAMILY_MEMBERS.find((m) => m.id === id)?.label).join(', ');
    Alert.alert(
      'Comparing Health Plans',
      `Insuring: ${names}\nComparing 30+ 1-Cr Cashless Health Insurance plans with 10,000+ network hospitals, zero waiting period, and pre-existing disease cover.`,
      [{ text: 'View 30+ Plans', style: 'default' }]
    );
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

        <Text style={styles.headerTitle}>Health Insurance</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            Alert.alert('Health Insurance Help', 'Get comprehensive ₹1 Crore medical cover for your entire family with cashless hospitalisation and 24x7 claims assistance.');
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
        {/* Member Selector Card */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorTitle}>Insurance made simple!</Text>
          <Text style={styles.selectorSubtitle}>Pick the family members you want to insure</Text>

          {/* Members Grid */}
          <View style={styles.membersGrid}>
            {FAMILY_MEMBERS.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              return (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.memberCol, isSelected && styles.memberColActive]}
                  onPress={() => toggleMember(member.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.memberAvatarCircle, isSelected && styles.memberAvatarSelected]}>
                    <Text style={{ fontSize: 26 }}>{member.emoji}</Text>
                  </View>

                  <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleSelected]}>
                    <Text style={styles.checkIcon}>{isSelected ? '✓' : '+'}</Text>
                  </View>

                  <Text style={[styles.memberLabel, isSelected && styles.memberLabelActive]}>
                    {member.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Find Plans CTA */}
          <TouchableOpacity
            style={styles.findPlansBtn}
            onPress={handleFindHealthPlans}
            activeOpacity={0.88}
          >
            <Text style={styles.findPlansText}>Find Plans</Text>
          </TouchableOpacity>
        </View>

        {/* Trusted Partners */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionSubHeading}>OUR TRUSTED PARTNERS</Text>
          <View style={styles.partnersGrid}>
            {HEALTH_PARTNERS.map((p) => (
              <View key={p} style={styles.partnerBadge}>
                <Text style={styles.partnerBadgeText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* The SmartWallet Advantage */}
        <View style={styles.advantageCard}>
          <Text style={styles.advantageHeading}>THE SMARTWALLET ADVANTAGE</Text>

          {/* Advisor Avatars Row */}
          <View style={styles.advisorsRow}>
            {['👩‍💼', '👨‍💼', '👩‍⚕️', '👨‍⚕️', '🧑‍💼', '👩‍💻'].map((emoji, idx) => (
              <View key={idx} style={styles.advisorCircle}>
                <Text style={{ fontSize: 16 }}>{emoji}</Text>
              </View>
            ))}
          </View>

          {/* Feature 1 */}
          <View style={styles.advFeatureItem}>
            <Text style={styles.advFeatureTitle}>Expert Advisors</Text>
            <Text style={styles.advFeatureDesc}>Our certified health advisors help you pick the right plan and maximize tax deductions under 80D.</Text>
          </View>

          {/* Feature 2 */}
          <View style={styles.advFeatureItem}>
            <Text style={styles.advFeatureTitle}>Lowest Premium</Text>
            <Text style={styles.advFeatureDesc}>30+ plans with incredible discounts and easy interest-free monthly installment options.</Text>
          </View>

          {/* Feature 3 */}
          <View style={styles.advFeatureItem}>
            <Text style={styles.advFeatureTitle}>Dedicated Relationship Manager</Text>
            <Text style={styles.advFeatureDesc}>Your 24/7 dedicated RM handles everything from hospital pre-authorisation to claim settlement.</Text>
          </View>
        </View>

        {/* 4 Steps Progress */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsSectionTitle}>Faster Insurance, Fewer Steps</Text>
          <View style={styles.stepsRow}>
            {[
              { n: '1', l: 'Choose\npolicy plan' },
              { n: '2', l: 'Submit\ndetails' },
              { n: '3', l: 'Complete\nKYC' },
              { n: '4', l: 'Get your\npolicy' },
            ].map((st) => (
              <View key={st.n} style={styles.stepCol}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepCircleNum}>{st.n}</Text>
                </View>
                <Text style={styles.stepLabel}>{st.l}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  selectorCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectorSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 18,
  },
  membersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  memberCol: {
    alignItems: 'center',
    flex: 1,
  },
  memberColActive: {},
  memberAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  memberAvatarSelected: {
    borderColor: Colors.forestGreenBorder,
    backgroundColor: Colors.forestGreenLight,
  },
  checkboxCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  checkboxCircleSelected: {
    backgroundColor: Colors.forestGreen,
    borderColor: Colors.forestGreen,
  },
  checkIcon: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  memberLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  findPlansBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  findPlansText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionBox: {
    marginBottom: 20,
  },
  sectionSubHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partnerBadge: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  advantageCard: {
    backgroundColor: '#1E293B', // Slate dark card
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  advantageHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  advisorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: -6,
  },
  advisorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  advFeatureItem: {
    marginBottom: 14,
  },
  advFeatureTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  advFeatureDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  stepsSection: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20,
  },
  stepsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
    textAlign: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleNum: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.forestGreenDark,
  },
  stepLabel: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '600',
  },
});

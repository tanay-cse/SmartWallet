import React from 'react';
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

// ==========================================
// 1. PAYMENT & TRANSFERS ICONS
// ==========================================

export function ToMobileIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="10" y="5" width="20" height="30" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
      <Rect x="12.5" y="8" width="15" height="20" rx="2" fill="#F8F9FA" />
      {/* Transfer Arrows */}
      <Path d="M15 15L20 18L15 21V15Z" fill="#D97706" />
      <Path d="M19 15L24 18L19 21V15Z" fill="#065F46" />
      <Circle cx="20" cy="31.5" r="1.5" fill="#64748B" />
    </Svg>
  );
}

export function ToBankIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M7 14L20 7L33 14H7Z" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
      <Rect x="10" y="16" width="3.5" height="11" rx="1" fill="#3B82F6" />
      <Rect x="18.25" y="16" width="3.5" height="11" rx="1" fill="#3B82F6" />
      <Rect x="26.5" y="16" width="3.5" height="11" rx="1" fill="#3B82F6" />
      <Rect x="6" y="27" width="28" height="3.5" rx="1" fill="#1E3A8A" />
      {/* Transfer Arrow */}
      <Path d="M22 34H33M33 34L29 30M33 34L29 38" stroke="#065F46" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ApproveToPayIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="6" y="9" width="28" height="18" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
      <Rect x="6" y="13" width="28" height="4.5" fill="#1E293B" />
      <Rect x="10" y="20" width="7" height="4" rx="1" fill="#D97706" />
      {/* Checkmark Flow */}
      <Circle cx="29" cy="27" r="6" fill="#065F46" />
      <Path d="M26.5 27L28.5 29L31.5 25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function UpiCircleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="11" r="5.5" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
      <SvgText x="20" y="14.5" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</SvgText>
      <Path d="M20 16.5V22" stroke="#64748B" strokeWidth="1.5" />
      <Path d="M12 28V23H28V28" stroke="#64748B" strokeWidth="1.5" />
      <Circle cx="12" cy="28" r="3.5" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
      <Circle cx="28" cy="28" r="3.5" fill="#D97706" stroke="#F59E0B" strokeWidth="1" />
      <Circle cx="20" cy="28" r="3.5" fill="#0F766E" stroke="#2DD4BF" strokeWidth="1" />
    </Svg>
  );
}

// ==========================================
// 2. RECHARGE & BILLS ICONS
// ==========================================

export function MobileRechargeIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="11" y="6" width="18" height="28" rx="4" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.2" />
      <Rect x="13.5" y="9" width="13" height="19" rx="1.5" fill="#0F172A" />
      <Path d="M21 11L16 19H21L19 26L25 17H20L21 11Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
      <Circle cx="20" cy="30.5" r="1.2" fill="#93C5FD" />
    </Svg>
  );
}

export function FastagRechargeIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="12" y="6" width="16" height="6.5" rx="2" fill="#065F46" />
      <SvgText x="20" y="11" fontSize="4.8" fontWeight="bold" fill="#FEF08A" textAnchor="middle">FASTag</SvgText>
      <Path d="M10 23L13 16H27L30 23H10Z" fill="#1E3A8A" />
      <Path d="M8 23H32V28C32 29 31 29.5 30 29.5H10C9 29.5 8 29 8 28V23Z" fill="#0F172A" />
      <Circle cx="13" cy="29" r="2.8" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
      <Circle cx="27" cy="29" r="2.8" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
      <Circle cx="11" cy="22" r="1.5" fill="#FEF08A" />
      <Circle cx="29" cy="22" r="1.5" fill="#FEF08A" />
    </Svg>
  );
}

export function ElectricityBillIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M20 7C14.5 7 10 11.5 10 17C10 20.8 12.2 24 15.5 25.8V28C15.5 28.5 16 29 16.5 29H23.5C24 29 24.5 28.5 24.5 28V25.8C27.8 24 30 20.8 30 17C30 11.5 25.5 7 20 7Z" fill="#D97706" />
      <Path d="M17 31H23V33H17V31Z" fill="#64748B" />
      <Path d="M18.5 33H21.5V34.5H18.5V33Z" fill="#475569" />
      <Path d="M21 11L17 17H21L19 23L25 15H20L21 11Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
    </Svg>
  );
}

export function LoanRepaymentIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M12 14C12 11 16 9 20 9C24 9 28 11 28 14L30 28C30 32 26 34 20 34C14 34 10 32 10 28L12 14Z" fill="#065F46" />
      <Path d="M16 11L20 8L24 11" stroke="#BBF7D0" strokeWidth="1.5" strokeLinecap="round" />
      <Rect x="20" y="17" width="14" height="15" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <Rect x="20" y="17" width="14" height="4.5" fill="#1E3A8A" />
      <SvgText x="27" y="28.5" fontSize="7.5" fontWeight="bold" fill="#0F172A" textAnchor="middle">31</SvgText>
    </Svg>
  );
}

// ==========================================
// 3. LOANS ICONS
// ==========================================

export function PersonalLoanIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="16" cy="11" r="4.5" fill="#1E3A8A" />
      <Path d="M9 25C9 20.5 12.5 17 17 17C20.5 17 23.5 19.5 24.5 23" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M23 20C23 17.5 25.5 16 28 16C30.5 16 33 17.5 33 20L34 29C34 32 31 34 28 34C25 34 22 32 22 29L23 20Z" fill="#D97706" />
      <SvgText x="28" y="27" fontSize="7" fontWeight="bold" fill="#FEF08A" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function MutualFundsLoanIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="9" y="17" width="4.5" height="14" rx="1.5" fill="#10B981" />
      <Rect x="15.5" y="11" width="4.5" height="20" rx="1.5" fill="#065F46" />
      <Rect x="22" y="15" width="4.5" height="16" rx="1.5" fill="#044E37" />
      <Path d="M25 21C25 18.5 27.5 17 30 17C32.5 17 35 18.5 35 21L36 30C36 33 33 35 30 35C27 35 24 33 24 30L25 21Z" fill="#D97706" />
      <SvgText x="30" y="28" fontSize="7" fontWeight="bold" fill="#FEF08A" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function GoldLoanIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Ellipse cx="19" cy="13" rx="9" ry="3.5" fill="#F59E0B" />
      <Path d="M10 13V20C10 22 14 23.5 19 23.5C24 23.5 28 22 28 20V13" fill="#D97706" />
      <Ellipse cx="19" cy="20" rx="9" ry="3.5" fill="#FBBF24" />
      <Path d="M24 22C24 19.5 26.5 18 29 18C31.5 18 34 19.5 34 22L35 30C35 33 32 35 29 35C26 35 23 33 23 30L24 22Z" fill="#065F46" />
      <SvgText x="29" y="29" fontSize="6.5" fontWeight="bold" fill="#BBF7D0" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function CreditScoreIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Gauge Arc */}
      <Path d="M8 26C8 19.4 13.4 14 20 14C26.6 14 32 19.4 32 26" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />
      <Path d="M8 26C8 22.5 10 19.5 13 17" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
      <Path d="M13 17C15 15 17.5 14 20 14" stroke="#0D9488" strokeWidth="4.5" />
      <Path d="M20 14C24.5 14 28.5 17 32 26" stroke="#065F46" strokeWidth="4.5" strokeLinecap="round" />
      {/* Needle pointing to excellent zone */}
      <Path d="M20 26L26.5 17.5" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="20" cy="26" r="3" fill="#0F172A" />
    </Svg>
  );
}

// ==========================================
// 4. GOLD, SILVER & PLATINUM ICONS
// ==========================================

export function DailyGoldIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="12" y="7" width="16" height="4" rx="2" fill="#D97706" />
      <Path d="M13 11H27V26C27 29.5 24 32 20 32C16 32 13 29.5 13 26V11Z" fill="#F0FDF4" stroke="#065F46" strokeWidth="1.5" />
      <Circle cx="18" cy="24" r="5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
      <Circle cx="23" cy="19.5" r="4.5" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1" />
      <SvgText x="18" y="26.5" fontSize="6" fontWeight="bold" fill="#78350F" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function BuyGoldIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="11" y="10" width="18" height="20" rx="3.5" fill="#D97706" stroke="#FDE68A" strokeWidth="1.2" />
      <Rect x="13.5" y="13" width="13" height="6.5" rx="1.5" fill="#78350F" />
      <SvgText x="20" y="18" fontSize="5.5" fontWeight="bold" fill="#FEF08A" textAnchor="middle">24K</SvgText>
      <Path d="M14 23.5H26M14 26.5H21" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DailySilverIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="12" y="7" width="16" height="4" rx="2" fill="#475569" />
      <Path d="M13 11H27V26C27 29.5 24 32 20 32C16 32 13 29.5 13 26V11Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
      <Circle cx="18" cy="24" r="5" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
      <Circle cx="23" cy="19.5" r="4.5" fill="#CBD5E1" stroke="#FFFFFF" strokeWidth="1" />
      <SvgText x="18" y="26.5" fontSize="6" fontWeight="bold" fill="#0F172A" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function BuySilverIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="12" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
      <Circle cx="20" cy="20" r="9" fill="#64748B" />
      <Path d="M20 13.5L22 18L26.5 20L22 22L20 26.5L18 22L13.5 20L18 18L20 13.5Z" fill="#F8FAFC" />
    </Svg>
  );
}

// ==========================================
// 5. INSURANCE ICONS
// ==========================================

export function BikeInsuranceIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="12" cy="26" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
      <Circle cx="28" cy="26" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
      <Path d="M12 26L18 20H24L28 26" stroke="#1E3A8A" strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M24 20L26 13H28" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M15 18L21 18" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function CarInsuranceIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M10 22L13 14H27L30 22H10Z" fill="#1E3A8A" />
      <Path d="M7 22H33V28C33 29.5 31.5 30 30 30H10C8.5 30 7 29.5 7 28V22Z" fill="#0F172A" />
      <Circle cx="12" cy="28" r="3" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
      <Circle cx="28" cy="28" r="3" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
      <Rect x="15" y="16" width="10" height="4.5" rx="1" fill="#EFF6FF" />
      {/* Shield Badge */}
      <Circle cx="20" cy="11" r="4.5" fill="#065F46" />
      <Path d="M18.5 11L19.5 12L21.5 10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

export function HealthInsuranceIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="9" y="12" width="22" height="19" rx="4" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
      <Path d="M15 12V9C15 7.9 15.9 7 17 7H23C24.1 7 25 7.9 25 9V12" stroke="#64748B" strokeWidth="2" />
      <Path d="M20 16V26M15 21H25" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}

export function LifeInsuranceIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M8 19C8 12.5 13.4 8 20 8C26.6 8 32 12.5 32 19C32 19 28 18 24 19C20 20 20 20 16 19C12 18 8 19 8 19Z" fill="#065F46" />
      <Path d="M20 19V29C20 30.5 19 32 17.5 32C16 32 15 30.5 15 29" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M25 21L29 23V27C29 30 27 32 25 33C23 32 21 30 21 27V23L25 21Z" fill="#1E3A8A" />
      <Path d="M23.5 27L25 28.5L27 25.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ==========================================
// 6. MUTUAL FUNDS ICONS
// ==========================================

export function BestSipFundsIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="10" y="9" width="18" height="22" rx="3.5" fill="#0F172A" stroke="#1E3A8A" strokeWidth="1.5" />
      <Rect x="10" y="9" width="18" height="5.5" fill="#1E3A8A" />
      <Path d="M14 19H22M14 23H20M14 27H18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="26" cy="25" r="5" fill="#065F46" stroke="#10B981" strokeWidth="1" />
      <SvgText x="26" y="27.5" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">★</SvgText>
    </Svg>
  );
}

export function ChotiSipIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="8" y="14" width="22" height="13" rx="2.5" fill="#044E37" />
      <Rect x="11" y="11" width="22" height="13" rx="2.5" fill="#065F46" stroke="#BBF7D0" strokeWidth="1" />
      <SvgText x="22" y="20" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹250</SvgText>
    </Svg>
  );
}

export function HighGrowthFundsIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M20 7L28 17H22V31H18V17H12L20 7Z" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
      <Circle cx="28" cy="26" r="4.5" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
      <SvgText x="28" y="28.5" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</SvgText>
    </Svg>
  );
}

export function DailySipIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x="8" y="14" width="22" height="13" rx="2.5" fill="#1E293B" />
      <Rect x="11" y="11" width="22" height="13" rx="2.5" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
      <SvgText x="22" y="20" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹10</SvgText>
    </Svg>
  );
}

// ==========================================
// TOP HEADER ICONS
// ==========================================

export function QrScannerHeaderIcon({ size = 38 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Rect width="44" height="44" rx="14" fill="#E6F4EA" stroke="#BBF7D0" strokeWidth="1.2" />
      {/* Scanner viewfinder lines */}
      <Path d="M13 18V13H18" stroke="#065F46" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M31 18V13H26" stroke="#065F46" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13 26V31H18" stroke="#065F46" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M31 26V31H26" stroke="#065F46" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Mini QR dots */}
      <Rect x="16.5" y="16.5" width="4" height="4" rx="1" fill="#065F46" />
      <Rect x="23.5" y="16.5" width="4" height="4" rx="1" fill="#065F46" />
      <Rect x="16.5" y="23.5" width="4" height="4" rx="1" fill="#065F46" />
      <Rect x="23.5" y="23.5" width="4" height="4" rx="1" fill="#065F46" />
    </Svg>
  );
}

export function QuestionHelpIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
      <Path d="M9.5 9.2C9.5 7.8 10.6 6.8 12 6.8C13.4 6.8 14.5 7.8 14.5 9.2C14.5 10.6 12 11.6 12 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.1" fill={color} />
    </Svg>
  );
}

export function SearchHeaderIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="6.8" stroke={color} strokeWidth="1.8" />
      <Path d="M16 16L20.5 20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

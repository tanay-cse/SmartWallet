import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export function ChipIcon({ size = 32 }: { size?: number }) {
  const width = size;
  const height = (size * 22) / 32;

  return (
    <Svg width={width} height={height} viewBox="0 0 32 22" fill="none">
      <Rect width="32" height="22" rx="3.5" fill="#E5B869" />
      <Rect x="1" y="1" width="30" height="20" rx="2.5" stroke="#B8860B" strokeWidth="0.8" />
      <Path d="M0 7.5h11M0 14.5h11M21 7.5h11M21 14.5h11" stroke="#996515" strokeWidth="0.8" />
      <Path d="M11 0v22M21 0v22" stroke="#996515" strokeWidth="0.8" />
      <Rect x="11" y="6" width="10" height="10" rx="2" fill="#D4AF37" stroke="#996515" strokeWidth="0.8" />
      <Circle cx="16" cy="11" r="2" fill="#B8860B" />
    </Svg>
  );
}

export function ContactlessIcon({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 16.5a6 6 0 0 1 0-9M12 19a9.5 9.5 0 0 0 0-14M15.5 21.5a13 13 0 0 0 0-19"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CopyIcon({ size = 18, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LockIcon({ size = 18, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function UnlockIcon({ size = 18, color = '#065F46' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M8 11V7a4 4 0 0 1 7.5-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function RewardStarIcon({ size = 18, color = '#065F46' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color + '15'}
      />
    </Svg>
  );
}

export function SparklesIcon({ size = 18, color = '#065F46' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v3m0 12v3M3 12h3m12 0h3M6.34 6.34l2.12 2.12m7.08 7.08l2.12 2.12M6.34 17.66l2.12-2.12m7.08-7.08l2.12-2.12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 20, color = '#0F172A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

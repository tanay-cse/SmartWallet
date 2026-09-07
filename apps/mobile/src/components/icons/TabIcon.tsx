import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type TabIconName = 'home' | 'vault' | 'pay' | 'invest' | 'budget' | 'card' | 'chart' | 'currency';

type TabIconProps = {
  name: TabIconName;
  color: string;
  focused: boolean;
  size?: number;
};

export function TabIcon({ name, color, focused, size = 20 }: TabIconProps) {
  const strokeWidth = focused ? 2.2 : 1.7;

  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={focused ? `${color}15` : 'none'}
          />
        </Svg>
      );

    case 'vault':
    case 'card':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="2.5"
            y="5.5"
            width="19"
            height="13"
            rx="2.5"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={focused ? `${color}15` : 'none'}
          />
          <Path d="M2.5 9.5h19" stroke={color} strokeWidth={strokeWidth} />
          <Path
            d="M6 14.5h4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'pay':
      // Detailed QR Code logo with 3 finder squares and bit matrices
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
            stroke={color}
            strokeLinejoin="round"
            strokeWidth={1.8}
          />
          <Path
            d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
            fill={color}
          />
        </Svg>
      );

    case 'invest':
    case 'chart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 19.5h18M5 15l4.5-5 4 4 5.5-6.5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M15 7.5h4v4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'budget':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10.5 5.5a6.5 6.5 0 106.5 6.5h-6.5V5.5z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={focused ? `${color}15` : 'none'}
          />
          <Path
            d="M13.5 9.5H20a6.5 6.5 0 00-6.5-6.5v6.5z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={focused ? color : 'none'}
          />
        </Svg>
      );

    case 'currency':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 4v16m4-14H9.5a3 3 0 000 6h5a3 3 0 010 6H8"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    default:
      return null;
  }
}

export function SearchIcon({ size = 18, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
      <Path d="M16.5 16.5L21 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 18, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EyeIcon({ size = 16, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 16, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FilterSlidersIcon({ size = 18, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h16M4 12h10M4 18h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CopyIcon({ size = 16, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="9" width="12" height="12" rx="2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function DownloadIcon({ size = 16, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 16, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={1.8} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={1.8} />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function FingerprintIcon({ size = 20, color = '#065F46' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 11c-1.5 0-3 .5-3 2v4M12 7c-3.5 0-6 2-6 6v3M12 3c-5.5 0-9 3.5-9 9v3M15 13c0-2-1.5-3-3-3M18 13c0-4-2.5-6-6-6M21 12c0-5-4-9-9-9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SyncIcon({ size = 20, color = '#065F46' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4v5h-5M4 20v-5h5M18.36 9A9 9 0 005.64 5.64L4 9M5.64 15a9 9 0 0012.72 3.36L20 15"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BankBuildingIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-6 9 6v2H3V9zM5 11v7M9 11v7M15 11v7M19 11v7M2 20h20" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CreditCardPlusIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M2 10h20M6 14h4" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="15" r="4" fill="#FFFFFF" stroke={color} strokeWidth={1.5} />
      <Path d="M18 13v4M16 15h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function FlashZapIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BrandIcon({ name, size = 18, color = '#0F172A' }: { name: string; size?: number; color?: string }) {
  switch (name.toLowerCase()) {
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.94-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.77-.95 2.83 1.02.08 2.05-.5 2.68-1.27z" />
        </Svg>
      );
    case 'paypal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 4h7a4 4 0 014 4c0 3-2 5-5 5H9.5L8 21H5L7 4z"
            fill={color}
          />
          <Path
            d="M9.5 9h6a3.5 3.5 0 013.5 3.5c0 2.5-1.8 4.5-4.5 4.5H11.5L10 21H7.5l2-12z"
            fill="#0284C7"
            fillOpacity={0.8}
          />
        </Svg>
      );
    case 'spotify':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Circle cx="12" cy="12" r="10" />
          <Path
            d="M7 9.5c3.2-1 6.8-.7 10 1M7.5 12.5c2.6-.8 5.6-.5 8.2.8M8 15.5c2.1-.6 4.4-.4 6.5.6"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
          <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
  }
}

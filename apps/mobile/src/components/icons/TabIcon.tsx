import Svg, { Path } from 'react-native-svg';

export type TabIconName = 'card' | 'chart' | 'pay' | 'budget' | 'currency';

type TabIconProps = {
  name: TabIconName;
  color: string;
  focused: boolean;
  size: number;
};

export function TabIcon({ name, color, focused, size }: TabIconProps) {
  const strokeWidth = focused ? 2.25 : 1.6;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'card' && (
        <Path
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2 2 0 0 0 2.25-2.25V6.75A2 2 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      )}
      {name === 'chart' && (
        <Path
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      )}
      {name === 'pay' && (
        <>
          <Path
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
            stroke={color}
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
          />
          <Path
            d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
            fill={color}
          />
        </>
      )}
      {name === 'budget' && (
        <>
          <Path
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
            stroke={color}
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
          />
          <Path
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
            stroke={color}
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
          />
        </>
      )}
      {name === 'currency' && (
        <Path
          d="M12 6v12m4.5-10.5V9a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 7.5 9v.75A2.25 2.25 0 0 0 9.75 12h4.5a2.25 2.25 0 0 1 2.25 2.25V15a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 7.5 15v-1.5"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      )}
    </Svg>
  );
}

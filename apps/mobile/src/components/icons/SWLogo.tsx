import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

type SWLogoProps = {
  size?: number;
  width?: number;
  height?: number;
  style?: ImageStyle;
};

export function SWLogo({
  size = 32,
  width,
  height,
  style,
}: SWLogoProps) {
  const h = height || size;
  const w = width || Math.round(h * 2.38);

  return (
    <Image
      source={require('../../../assets/sw-logo.png')}
      style={[{ width: w, height: h }, style]}
      resizeMode="contain"
    />
  );
}

export function SWLogoBadge({ size = 32 }: { size?: number }) {
  return (
    <View style={[styles.badgeContainer, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <Rect width="44" height="44" rx="12" fill="#FFFFFF" />
        <Rect width="44" height="44" rx="12" stroke={Colors.forestGreenLight} strokeWidth="1.5" />
      </Svg>
      <Image
        source={require('../../../assets/sw-logo.png')}
        style={[styles.badgeImage, { width: size * 0.72, height: (size * 0.72) / 2.38 }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeImage: {
    position: 'absolute',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CardNetwork } from '../../types/vault';

type CardNetworkLogoProps = {
  network: CardNetwork;
  size?: number;
};

export function CardNetworkLogo({ network, size = 32 }: CardNetworkLogoProps) {
  switch (network) {
    case 'visa':
      return (
        <View style={styles.visaBox}>
          <Text style={styles.visaText}>VISA</Text>
        </View>
      );

    case 'mastercard':
      return (
        <Svg width={size} height={(size * 20) / 32} viewBox="0 0 32 20" fill="none">
          <Circle cx="11" cy="10" r="9" fill="#EB001B" fillOpacity="0.9" />
          <Circle cx="21" cy="10" r="9" fill="#F79E1B" fillOpacity="0.9" />
        </Svg>
      );

    case 'rupay':
      return (
        <View style={styles.rupayBox}>
          <Text style={styles.rupayText}>RuPay</Text>
        </View>
      );

    case 'amex':
      return (
        <View style={styles.amexBox}>
          <Text style={styles.amexText}>AMEX</Text>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  visaBox: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaText: {
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontSize: 16,
    letterSpacing: 1.2,
  },
  rupayBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rupayText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  amexBox: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  amexText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

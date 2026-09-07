import React from 'react';
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardDetailView } from '../components/vault/CardDetailView';
import { Colors } from '../theme/colors';
import { VaultCard } from '../types/vault';
import type { RootStackParamList } from '../../App';

type CardDetailScreenRouteProp = RouteProp<RootStackParamList, 'CardDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CardDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CardDetailScreenRouteProp>();
  const { card } = route.params;

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />
      <CardDetailView
        card={card}
        onBack={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusIcon } from '../components/icons/BudgetIcons';
import { AddCardModal } from '../components/vault/AddCardModal';
import { CardDetailView } from '../components/vault/CardDetailView';
import { StackedCardItem } from '../components/vault/StackedCardItem';
import { VaultHeader } from '../components/vault/VaultHeader';
import { MOCK_VAULT_CARDS } from '../data/mockVaultData';
import { Colors } from '../theme/colors';
import { VaultCard } from '../types/vault';

export function VaultScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const [cards, setCards] = useState<VaultCard[]>(MOCK_VAULT_CARDS);
  const [selectedCard, setSelectedCard] = useState<VaultCard | null>(null);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);

  // Smooth simple fade transition between Stacked List and Detail view
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelectCard = (card: VaultCard) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSelectedCard(card);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBackToStack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSelectedCard(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddCard = (newCard: VaultCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    handleBackToStack();
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: topPadding }]}>
      <RNStatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent
      />

      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        {selectedCard ? (
          /* ==================== EXPANDED CARD DETAIL VIEW ==================== */
          <CardDetailView
            card={selectedCard}
            onBack={handleBackToStack}
            onDeleteCard={handleDeleteCard}
          />
        ) : (
          /* ==================== NATIVE STACKED LIST VIEW ==================== */
          <View style={styles.deckContainer}>
            {/* Header with Card Count and AES-256 Badge */}
            <VaultHeader
              cardCount={cards.length}
              onOptionsPress={() => setIsAddCardVisible(true)}
            />

            {/* Standard ScrollView with Native Negative Margins (No RefreshControl) */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              overScrollMode="always"
            >
              <View style={styles.cardsStack}>
                {cards.map((card, index) => (
                  <StackedCardItem
                    key={card.id}
                    card={card}
                    index={index}
                    totalCards={cards.length}
                    marginTop={index === 0 ? 0 : -105}
                    onPress={() => handleSelectCard(card)}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Floating Minimalist "+ Add Card" Button */}
            <TouchableOpacity
              style={styles.floatingAddBtn}
              onPress={() => setIsAddCardVisible(true)}
              activeOpacity={0.85}
            >
              <PlusIcon size={16} color="#FFFFFF" />
              <Text style={styles.floatingAddText}>Add card</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Add Card Modal */}
      <AddCardModal
        visible={isAddCardVisible}
        onClose={() => setIsAddCardVisible(false)}
        onAddCard={handleAddCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  deckContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 300, // Massive padding to force proper scroll height & reveal bottom cards
  },
  cardsStack: {
    width: '100%',
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  floatingAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

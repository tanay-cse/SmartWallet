export type CardNetwork = 'visa' | 'mastercard' | 'rupay' | 'amex';

export type CardType = 'credit' | 'debit' | 'forex';

export type CardPerk = {
  id: string;
  title: string;
  description: string;
  tag?: string;
};

export type VaultCard = {
  // Required fields from prompt
  id: string;
  bank: string;
  name: string;
  network: CardNetwork;
  last4: string;
  bestCategory: string;
  rewardRate: string;

  // Rich metadata for detailed card view
  cardType: CardType;
  cardholderName: string;
  expiryDate: string;
  balanceOrLimit: number;
  availableLimit: number;
  currency: string;
  gradientColors: [string, string, string?];
  patternType: 'circles' | 'waves' | 'lines' | 'geometric';
  baseRewardRate: string;
  perks: CardPerk[];
  isLocked?: boolean;
  billingDate?: string;
};

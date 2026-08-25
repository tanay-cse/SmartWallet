import { RecommendationService } from './recommendation.service';
import { CardInput } from './recommendation.types';

describe('RecommendationService', () => {
  const service = new RecommendationService();

  it('clear winner: picks the card with the highest reward rate for the category', () => {
    const cards: CardInput[] = [
      {
        cardId: 'card-a',
        nickname: 'HDFC Millennia',
        rewardPrograms: [{ category: 'Dining', multiplier: 5 }],
      },
      {
        cardId: 'card-b',
        nickname: 'Axis Airtel',
        rewardPrograms: [{ category: 'Dining', multiplier: 2 }],
      },
    ];

    const ranked = service.rankCardsForCategory(cards, 'Dining', 1000);

    expect(ranked[0].cardId).toBe('card-a');
    expect(ranked[0].rate).toBe(5);
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });

  it('tie-break by milestone proximity: equal rates, but one card is about to unlock a bonus tier', () => {
    const cards: CardInput[] = [
      {
        cardId: 'card-a',
        nickname: 'ICICI Amazon Pay',
        rewardPrograms: [{ category: 'Shopping', multiplier: 3 }], // no cap tracked
      },
      {
        cardId: 'card-b',
        nickname: 'SBI SimplyClick',
        rewardPrograms: [
          {
            category: 'Shopping',
            multiplier: 3, // same base rate as card-a
            capAmt: 5000,
            currentSpend: 4600, // this ₹500 spend crosses the 90% mark (4600+500=5100 >= 4500)
          },
        ],
      },
    ];

    const ranked = service.rankCardsForCategory(cards, 'Shopping', 500);

    // Same base rate, but card-b should win because it earns the milestone bonus.
    expect(ranked[0].cardId).toBe('card-b');
    expect(ranked[0].milestoneBonus).toBe(true);
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    expect(ranked[1].milestoneBonus).toBe(false);
  });

  it('fully tied cards (same rate, no milestone on either) fall back to alphabetical nickname order', () => {
    const cards: CardInput[] = [
      {
        cardId: 'card-a',
        nickname: 'Zeta Card',
        rewardPrograms: [{ category: 'Fuel', multiplier: 2 }],
      },
      {
        cardId: 'card-b',
        nickname: 'Alpha Card',
        rewardPrograms: [{ category: 'Fuel', multiplier: 2 }],
      },
    ];

    const ranked = service.rankCardsForCategory(cards, 'Fuel', 800);

    expect(ranked[0].score).toBe(ranked[1].score); // confirm this is genuinely a tie
    expect(ranked[0].nickname).toBe('Alpha Card'); // 'Alpha' sorts before 'Zeta'
    expect(ranked[1].nickname).toBe('Zeta Card');
  });

  it('a card with no reward program for the category still appears, ranked last, with rate 0', () => {
    const cards: CardInput[] = [
      {
        cardId: 'card-a',
        nickname: 'Travel Card',
        rewardPrograms: [{ category: 'Travel', multiplier: 6 }],
      },
      {
        cardId: 'card-b',
        nickname: 'No Dining Rewards Card',
        rewardPrograms: [{ category: 'Travel', multiplier: 1 }], // no "Dining" entry at all
      },
    ];

    const ranked = service.rankCardsForCategory(cards, 'Dining', 500);

    expect(ranked.every((r) => r.rate === 0)).toBe(true);
    expect(ranked[0].reasoning).toMatch(/no specific reward rate/i);
  });
});

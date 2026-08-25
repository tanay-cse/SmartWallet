import { Injectable } from '@nestjs/common';
import { CardInput, RankedCard, RewardProgramInput } from './recommendation.types';

// How much a milestone-proximity bonus is worth relative to reward rate.
// Kept as a named constant (not a magic number) so it's easy to tune later
// without hunting through the scoring logic.
const MILESTONE_BONUS_WEIGHT = 0.5;

// "Within 10% of a milestone" = after this transaction, spend in that
// category would be at or above 90% of the cap, and the cap hasn't
// already been reached before this transaction (no point bonusing a
// milestone that's already unlocked).
const MILESTONE_PROXIMITY_THRESHOLD = 0.9;

@Injectable()
export class RecommendationService {
  /**
   * Ranks a user's cards for a given spend category + amount.
   * Pure function — no DB access, no side effects. Safe to unit test
   * directly and reuse from the controller (Prompt 8) or elsewhere.
   */
  rankCardsForCategory(cards: CardInput[], category: string, amount: number): RankedCard[] {
    const ranked = cards.map((card) => this.scoreCard(card, category, amount));

    return ranked.sort((a, b) => {
      // 1. Highest score wins.
      if (b.score !== a.score) return b.score - a.score;
      // 2. Equal score — prefer the card that's actually closer to unlocking
      //    a milestone (even if it didn't cross the 90% bonus threshold),
      //    so ties resolve toward the "more useful long-term" card.
      const aProximity = this.milestoneProximity(a, cards, category, amount);
      const bProximity = this.milestoneProximity(b, cards, category, amount);
      if (bProximity !== aProximity) return bProximity - aProximity;
      // 3. Still tied — fall back to alphabetical nickname for a fully
      //    deterministic, explainable order (no arbitrary array-order ties).
      return a.nickname.localeCompare(b.nickname);
    });
  }

  private scoreCard(card: CardInput, category: string, amount: number): RankedCard {
    const program = this.findProgram(card, category);
    const rate = program?.multiplier ?? 0;

    const milestoneBonus = program ? this.hasMilestoneBonus(program, amount) : false;
    const score = rate + (milestoneBonus ? MILESTONE_BONUS_WEIGHT : 0);

    return {
      cardId: card.cardId,
      nickname: card.nickname,
      rate,
      milestoneBonus,
      score,
      reasoning: this.buildReasoning(card.nickname, category, rate, amount, milestoneBonus, program),
    };
  }

  private findProgram(card: CardInput, category: string): RewardProgramInput | undefined {
    return card.rewardPrograms.find(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  private hasMilestoneBonus(program: RewardProgramInput, amount: number): boolean {
    if (!program.capAmt || program.capAmt <= 0) return false;

    const currentSpend = program.currentSpend ?? 0;
    if (currentSpend >= program.capAmt) return false; // already unlocked, no bonus needed

    const projectedSpend = currentSpend + amount;
    return projectedSpend / program.capAmt >= MILESTONE_PROXIMITY_THRESHOLD;
  }

  /** Used only for tie-breaking: how close (0-1) a card is to its milestone, 0 if no cap set. */
  private milestoneProximity(
    ranked: RankedCard,
    cards: CardInput[],
    category: string,
    amount: number,
  ): number {
    const card = cards.find((c) => c.cardId === ranked.cardId);
    const program = card && this.findProgram(card, category);
    if (!program?.capAmt || program.capAmt <= 0) return 0;

    const projectedSpend = (program.currentSpend ?? 0) + amount;
    return Math.min(projectedSpend / program.capAmt, 1);
  }

  private buildReasoning(
    nickname: string,
    category: string,
    rate: number,
    amount: number,
    milestoneBonus: boolean,
    program?: RewardProgramInput,
  ): string {
    if (rate === 0) {
      return `${nickname} has no specific reward rate for ${category}.`;
    }

    const earn = Math.round((amount / 100) * rate);
    let text = `Earns ${rate}x on ${category} — about ${earn} points on this ₹${amount} spend.`;

    if (milestoneBonus && program?.capAmt) {
      const remaining = Math.max(program.capAmt - (program.currentSpend ?? 0), 0);
      text += ` This spend also pushes it within reach of its ₹${program.capAmt} milestone (₹${remaining} away before this transaction).`;
    }

    return text;
  }
}

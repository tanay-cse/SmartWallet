// Shapes used by the scoring engine. Kept separate from the Prisma-generated
// types on purpose — this service is pure logic and shouldn't need to know
// about the ORM. The controller (Prompt 8) is responsible for mapping
// Prisma's Card/RewardProgram/Transaction rows into these shapes.

export interface RewardProgramInput {
  category: string;
  /** Reward rate for this category, e.g. 5 = "5x points". */
  multiplier: number;
  /**
   * Milestone / bonus-tier threshold for this category this billing cycle
   * (maps to RewardProgram.cap_amt). Null/undefined = no milestone tracked.
   */
  capAmt?: number | null;
  /** How much has already been spent in this category this cycle. */
  currentSpend?: number;
}

export interface CardInput {
  cardId: string;
  nickname: string;
  rewardPrograms: RewardProgramInput[];
}

export interface RankedCard {
  cardId: string;
  nickname: string;
  /** Reward rate for the requested category (0 if the card has none). */
  rate: number;
  /** Whether this recommendation includes a milestone-proximity bonus. */
  milestoneBonus: boolean;
  /** Final ranking score (rate + bonus weight). */
  score: number;
  /** Short, user-facing explanation — keeps the recommendation explainable. */
  reasoning: string;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function startOfCurrentCycle(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** All transactions for the user's own cards, newest first, optionally filtered. */
  async listTransactions(userId: string, category?: string, cardId?: string) {
    return this.prisma.transaction.findMany({
      where: {
        card: { userId },
        ...(category ? { category } : {}),
        ...(cardId ? { cardId } : {}),
      },
      orderBy: { txnTime: 'desc' },
      include: { card: { select: { nickname: true, network: true } } },
    });
  }

  /** One transaction by id, scoped to the requesting user (used for status polling). */
  async getTransaction(userId: string, txnId: string) {
    const txn = await this.prisma.transaction.findFirst({
      where: { txnId, card: { userId } },
    });
    if (!txn) throw new NotFoundException('Transaction not found');
    return txn;
  }

  /**
   * Summary for one card: mock available balance, total points earned this
   * cycle, best-performing category, and a category-wise spend breakdown.
   * "Balance" is explicitly simulated — SmartWallet never holds real bank
   * balances (see SRS / architecture: regulated rails are sandboxed).
   */
  async getCardSummary(userId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { cardId, userId },
      include: { rewardPrograms: true },
    });
    if (!card) throw new NotFoundException('Card not found in your vault');

    const cycleStart = startOfCurrentCycle();
    const transactions = await this.prisma.transaction.findMany({
      where: { cardId, status: 'SUCCESS', txnTime: { gte: cycleStart } },
    });

    // Points earned this cycle = sum over transactions of (amount/100 * category multiplier)
    let totalPoints = 0;
    const spendByCategory: Record<string, number> = {};

    for (const txn of transactions) {
      spendByCategory[txn.category] = (spendByCategory[txn.category] ?? 0) + txn.amount;

      const program = card.rewardPrograms.find(
        (p) => p.category.toLowerCase() === txn.category.toLowerCase(),
      );
      const rate = program?.multiplier ?? 0;
      totalPoints += Math.round((txn.amount / 100) * rate);
    }

    const bestProgram = [...card.rewardPrograms].sort((a, b) => b.multiplier - a.multiplier)[0];

    // Deterministic mock balance so it doesn't change on every request —
    // seeded from the card id so demos look consistent, clearly not real money.
    const mockBalance = this.deterministicMockBalance(card.cardId);

    return {
      cardId: card.cardId,
      nickname: card.nickname,
      network: card.network,
      upiId: card.upiId,
      mockBalance,
      pointsEarnedThisCycle: totalPoints,
      bestCategory: bestProgram?.category ?? null,
      bestMultiplier: bestProgram?.multiplier ?? null,
      spendByCategory,
      transactionCount: transactions.length,
    };
  }

  private deterministicMockBalance(cardId: string): number {
    // Simple hash of the card id -> a stable pseudo-random balance
    // between ₹50,000 and ₹5,00,000, purely for demo realism.
    let hash = 0;
    for (const char of cardId) hash = (hash * 31 + char.charCodeAt(0)) % 1000000;
    return 50000 + (hash % 450000);
  }
}

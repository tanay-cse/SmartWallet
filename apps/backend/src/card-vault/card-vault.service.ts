import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardVaultService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async createCard(data: {
    userId: string;
    tokenId: string;
    network: string;
    nickname: string;
  }) {
    return this.prisma.card.create({
      data: {
        userId: data.userId,
        tokenId: data.tokenId,
        network: data.network,
        nickname: data.nickname,
      },
    });
  }

  // GET ALL
  async getAllCards(userId?: string) {
    return this.prisma.card.findMany({
      where: userId ? { userId } : undefined,
      include: {
        rewardPrograms: true,
      },
    });
  }

  // GET ONE
  async getCard(cardId: string) {
    const card = await this.prisma.card.findUnique({
      where: { cardId },
      include: {
        rewardPrograms: true,
      },
    });

    if (!card) {
      throw new NotFoundException(`Card ${cardId} not found`);
    }

    return card;
  }

  // UPDATE
  async updateCard(
    cardId: string,
    data: {
      nickname?: string;
      network?: string;
      tokenId?: string;
    },
  ) {
    await this.getCard(cardId);

    return this.prisma.card.update({
      where: { cardId },
      data,
    });
  }

  // DELETE
  async deleteCard(cardId: string) {
    await this.getCard(cardId);

    await this.prisma.card.delete({
      where: { cardId },
    });

    return {
      message: 'Card deleted successfully',
      cardId,
    };
  }

  // REWARD CALCULATION
  async getRewards(cardId: string, category: string, amount: number) {
    await this.getCard(cardId);

    const rewardProgram = await this.prisma.rewardProgram.findFirst({
      where: {
        cardId,
        category: category.toLowerCase(),
      },
    });

    if (!rewardProgram) {
      return {
        cardId,
        category,
        amount,
        multiplier: 0,
        reward: 0,
        message: 'No reward program found for this category',
      };
    }

    const reward = amount * rewardProgram.multiplier;

    return {
      cardId,
      category,
      amount,
      multiplier: rewardProgram.multiplier,
      reward,
      capAmt: rewardProgram.capAmt,
    };
  }
}

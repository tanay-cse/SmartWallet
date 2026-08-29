import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardVaultService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE CARD
  async createCard(
    userId: string,
    data: {
      tokenId: string;
      network: string;
      nickname: string;
    },
  ) {
    return this.prisma.card.create({
      data: {
        userId,
        tokenId: data.tokenId,
        network: data.network,
        nickname: data.nickname,
      },
    });
  }

  // GET ALL CARDS OF LOGGED-IN USER
  async getAllCards(userId: string) {
    return this.prisma.card.findMany({
      where: { userId },
      include: {
        rewardPrograms: true,
      },
    });
  }

  // GET ONE CARD OF LOGGED-IN USER
  async getCard(cardId: string, userId: string) {
    const card = await this.prisma.card.findFirst({
      where: {
        cardId,
        userId,
      },
      include: {
        rewardPrograms: true,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  // UPDATE CARD
  async updateCard(
    cardId: string,
    userId: string,
    data: {
      nickname?: string;
      network?: string;
      tokenId?: string;
    },
  ) {
    await this.getCard(cardId, userId);

    return this.prisma.card.update({
      where: { cardId },
      data,
    });
  }

  // DELETE CARD
  async deleteCard(cardId: string, userId: string) {
    await this.getCard(cardId, userId);

    await this.prisma.card.delete({
      where: { cardId },
    });

    return {
      message: 'Card deleted successfully',
      cardId,
    };
  }

  // GET REWARD FOR A CATEGORY AND AMOUNT
  async getRewards(
    cardId: string,
    userId: string,
    category: string,
    amount: number,
  ) {
    await this.getCard(cardId, userId);

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

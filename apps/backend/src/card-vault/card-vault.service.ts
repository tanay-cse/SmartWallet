import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  // Validate category
  if (!category || category.trim() === '') {
    throw new BadRequestException('Category is required');
  }

  // Validate amount
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new BadRequestException(
      'Amount must be a positive number',
    );
  }

  const normalizedCategory = category.trim().toLowerCase();

  const rewardProgram =
    await this.prisma.rewardProgram.findFirst({
      where: {
        cardId,
        category: normalizedCategory,
      },
    });

  // No reward for this category
  if (!rewardProgram) {
    return {
      cardId,
      category: normalizedCategory,
      amount,
      multiplier: 0,
      reward: 0,
      capAmt: 0,
      message: 'No reward program found for this category',
    };
  }

  let reward = amount * rewardProgram.multiplier;

  // Apply reward cap if one exists.
  // capAmt = 0 means uncapped.
  if (
    rewardProgram.capAmt > 0 &&
    reward > rewardProgram.capAmt
  ) {
    reward = rewardProgram.capAmt;
  }

  return {
    cardId,
    category: normalizedCategory,
    amount,
    multiplier: rewardProgram.multiplier,
    reward,
    capAmt: rewardProgram.capAmt,
  };
}

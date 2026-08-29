import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CardVaultService } from './card-vault.service';

@Controller('cards')
export class CardVaultController {
  constructor(private readonly cardVaultService: CardVaultService) {}

  // POST /cards
  @Post()
  createCard(
    @Body()
    body: {
      userId: string;
      tokenId: string;
      network: string;
      nickname: string;
    },
  ) {
    return this.cardVaultService.createCard(body);
  }

  // GET /cards
  @Get()
  getAllCards(@Query('userId') userId?: string) {
    return this.cardVaultService.getAllCards(userId);
  }

  // GET /cards/:id
  @Get(':id')
  getCard(@Param('id') cardId: string) {
    return this.cardVaultService.getCard(cardId);
  }

  // PATCH /cards/:id
  @Patch(':id')
  updateCard(
    @Param('id') cardId: string,
    @Body()
    body: {
      nickname?: string;
      network?: string;
      tokenId?: string;
    },
  ) {
    return this.cardVaultService.updateCard(cardId, body);
  }

  // DELETE /cards/:id
  @Delete(':id')
  deleteCard(@Param('id') cardId: string) {
    return this.cardVaultService.deleteCard(cardId);
  }

  // GET /cards/:id/rewards
  @Get(':id/rewards')
  getRewards(
    @Param('id') cardId: string,
    @Query('category') category: string,
    @Query('amount') amount: string,
  ) {
    return this.cardVaultService.getRewards(
      cardId,
      category,
      Number(amount),
    );
  }
}

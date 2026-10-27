import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardVaultService } from './card-vault.service';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardVaultController {
  constructor(private readonly cardVaultService: CardVaultService) { }

  // POST /cards
  @Post()
  createCard(
    @Req() req: { user: { userId: string; email: string } },
    @Body()
    body: {
      tokenId: string;
      network: string;
      nickname: string;
      upiId: string;
    },
  ) {
    return this.cardVaultService.createCard(req.user.userId, body);
  }

  // GET /cards
  @Get()
  getAllCards(
    @Req() req: { user: { userId: string; email: string } },
  ) {
    return this.cardVaultService.getAllCards(req.user.userId);
  }

  // GET /cards/:id/rewards?category=travel&amount=2000
  @Get(':id/rewards')
  getRewards(
    @Req() req: { user: { userId: string; email: string } },
    @Param('id') cardId: string,
    @Query('category') category: string,
    @Query('amount') amount: string,
  ) {
    return this.cardVaultService.getRewards(
      cardId,
      req.user.userId,
      category,
      Number(amount),
    );
  }

  // GET /cards/:id
  @Get(':id')
  getCard(
    @Req() req: { user: { userId: string; email: string } },
    @Param('id') cardId: string,
  ) {
    return this.cardVaultService.getCard(
      cardId,
      req.user.userId,
    );
  }

  // PATCH /cards/:id
  @Patch(':id')
  updateCard(
    @Req() req: { user: { userId: string; email: string } },
    @Param('id') cardId: string,
    @Body()
    body: {
      nickname?: string;
      network?: string;
      tokenId?: string;
    },
  ) {
    return this.cardVaultService.updateCard(
      cardId,
      req.user.userId,
      body,
    );
  }

  // DELETE /cards/:id
  @Delete(':id')
  deleteCard(
    @Req() req: { user: { userId: string; email: string } },
    @Param('id') cardId: string,
  ) {
    return this.cardVaultService.deleteCard(
      cardId,
      req.user.userId,
    );
  }
}

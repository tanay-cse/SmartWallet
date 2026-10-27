import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('transactions')
  async list(
    @Request() req: { user: { userId: string } },
    @Query('category') category?: string,
    @Query('cardId') cardId?: string,
  ) {
    return this.transactionsService.listTransactions(req.user.userId, category, cardId);
  }

  @Get('transactions/:txnId')
  async getOne(@Request() req: { user: { userId: string } }, @Param('txnId') txnId: string) {
    return this.transactionsService.getTransaction(req.user.userId, txnId);
  }

  @Get('cards/:cardId/summary')
  async cardSummary(
    @Request() req: { user: { userId: string } },
    @Param('cardId') cardId: string,
  ) {
    return this.transactionsService.getCardSummary(req.user.userId, cardId);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetService } from './budget.service';

@UseGuards(AuthGuard('jwt'))
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // POST /budget
  @Post()
  createBudget(
    @Req() req: { user: { userId: string; email: string } },
    @Body()
    body: {
      month: string;
      totalLimit: number;
      entries: {
        category: string;
        limitAmt: number;
      }[];
    },
  ) {
    return this.budgetService.createBudget(req.user.userId, body);
  }

  // GET /budget?month=2026-09
  @Get()
  getBudget(
    @Req() req: { user: { userId: string; email: string } },
    @Query('month') month: string,
  ) {
    return this.budgetService.getBudget(req.user.userId, month);
  }

  // PUT /budget/:budgetId/entries
  @Put(':budgetId/entries')
  updateCategoryBudget(
    @Req() req: { user: { userId: string; email: string } },
    @Param('budgetId') budgetId: string,
    @Body()
    body: {
      category: string;
      limitAmt: number;
    },
  ) {
    return this.budgetService.upsertBudgetEntry(
      req.user.userId,
      budgetId,
      body,
    );
  }
}

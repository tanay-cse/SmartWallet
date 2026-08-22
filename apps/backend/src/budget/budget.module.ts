import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

/** Budget & Savings Service — tracks daily spend against budget, sends notifications and recommendations (FR-6, FR-7, FR-8) */
@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}

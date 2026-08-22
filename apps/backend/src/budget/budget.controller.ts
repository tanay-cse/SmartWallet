import { Controller } from '@nestjs/common';
import { BudgetService } from './budget.service';

/** Handles /budget routes — monthly budgets and category-wise entries */
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}
  // Routes will be added in the budget implementation task
}

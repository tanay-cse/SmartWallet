import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a monthly budget
  async createBudget(
    userId: string,
    data: {
      month: string;
      totalLimit: number;
      entries: {
        category: string;
        limitAmt: number;
      }[];
    },
  ) {
    const totalAllocated = data.entries.reduce(
      (sum, entry) => sum + Number(entry.limitAmt),
      0,
    );

    if (totalAllocated > Number(data.totalLimit)) {
      throw new BadRequestException(
        'Total category allocation cannot exceed total budget limit',
      );
    }

    return this.prisma.budget.create({
      data: {
        userId,
        month: data.month,
        totalLimit: Number(data.totalLimit),
        budgetEntries: {
          create: data.entries.map((entry) => ({
            category: entry.category.toLowerCase(),
            limitAmt: Number(entry.limitAmt),
          })),
        },
      },
      include: {
        budgetEntries: true,
      },
    });
  }

  // Get a user's budget for a particular month
  async getBudget(userId: string, month: string) {
    const budget = await this.prisma.budget.findUnique({
      where: {
        userId_month: {
          userId,
          month,
        },
      },
      include: {
        budgetEntries: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    // Calculate category-wise spending and remaining amount
    const categories = budget.budgetEntries.map((entry) => {
      const spent = entry.transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );

      return {
        entryId: entry.entryId,
        category: entry.category,
        limitAmt: entry.limitAmt,
        spent,
        remaining: entry.limitAmt - spent,
      };
    });

    const totalSpent = categories.reduce(
      (sum, category) => sum + category.spent,
      0,
    );

    return {
      budgetId: budget.budgetId,
      month: budget.month,
      totalLimit: budget.totalLimit,
      totalSpent,
      totalRemaining: budget.totalLimit - totalSpent,
      categories,
    };
  }

  // Add or update a category allocation
  async upsertBudgetEntry(
    userId: string,
    budgetId: string,
    data: {
      category: string;
      limitAmt: number;
    },
  ) {
    const budget = await this.prisma.budget.findFirst({
      where: {
        budgetId,
        userId,
      },
      include: {
        budgetEntries: true,
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    const category = data.category.toLowerCase();

    const otherEntries = budget.budgetEntries.filter(
      (entry) => entry.category !== category,
    );

    const totalOtherLimits = otherEntries.reduce(
      (sum, entry) => sum + entry.limitAmt,
      0,
    );

    if (totalOtherLimits + Number(data.limitAmt) > budget.totalLimit) {
      throw new BadRequestException(
        'Category allocation exceeds total budget limit',
      );
    }

    return this.prisma.budgetEntry.upsert({
      where: {
        budgetId_category: {
          budgetId,
          category,
        },
      },
      update: {
        limitAmt: Number(data.limitAmt),
      },
      create: {
        budgetId,
        category,
        limitAmt: Number(data.limitAmt),
      },
    });
  }
}

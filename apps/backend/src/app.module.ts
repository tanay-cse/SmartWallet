import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardVaultModule } from './card-vault/card-vault.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { PaymentsModule } from './payments/payments.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { BudgetModule } from './budget/budget.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    CardVaultModule,
    RecommendationModule,
    PaymentsModule,
    PortfolioModule,
    BudgetModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

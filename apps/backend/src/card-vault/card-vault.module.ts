import { Module } from '@nestjs/common';
import { CardVaultController } from './card-vault.controller';
import { CardVaultService } from './card-vault.service';

/** Card Vault Service — card CRUD and reward-catalog matching (FR-1, FR-2) */
@Module({
  controllers: [CardVaultController],
  providers: [CardVaultService],
  exports: [CardVaultService],
})
export class CardVaultModule {}

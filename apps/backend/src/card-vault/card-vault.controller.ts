import { Controller } from '@nestjs/common';
import { CardVaultService } from './card-vault.service';

/** Handles /cards routes — card CRUD and reward-program queries */
@Controller('cards')
export class CardVaultController {
  constructor(private readonly cardVaultService: CardVaultService) {}
  // Routes will be added in the card-vault implementation task
}

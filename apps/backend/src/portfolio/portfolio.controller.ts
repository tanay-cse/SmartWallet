import { Controller } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

/** Handles /portfolio routes — holdings, buy/sell orders */
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}
  // Routes will be added in the portfolio implementation task
}

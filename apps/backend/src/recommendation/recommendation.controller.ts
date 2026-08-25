import { Controller } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

/** Handles /recommendations routes — AI card scoring and ranking */
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }
  // Routes will be added in the recommendation implementation task
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  /** GET /health — liveness probe */
  @Get('health')
  health(): { status: string } {
    return { status: 'ok'};
  }
}

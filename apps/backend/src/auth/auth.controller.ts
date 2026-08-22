import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

/** Handles /auth routes — signup, login, token refresh */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Routes will be added in the auth implementation task
}

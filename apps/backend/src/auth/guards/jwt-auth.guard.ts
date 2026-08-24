import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Use this on any controller/route across the app to require a valid
// access token, e.g.:
//   @UseGuards(JwtAuthGuard)
//   @Get('cards')
//   getCards(@Request() req) { ... req.user.userId ... }
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

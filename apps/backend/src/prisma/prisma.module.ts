import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global so every other module (auth, card-vault, recommendation, etc.)
// can inject PrismaService without importing PrismaModule each time.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

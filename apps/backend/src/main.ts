import 'dotenv/config';
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
  console.log(`SmartWallet backend running on http://localhost:${port}`);
}
bootstrap();

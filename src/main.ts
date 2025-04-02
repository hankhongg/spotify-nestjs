import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // seeding
  const seedService = app.get(SeedService);
  await seedService.seed();

  // get the configuration from the config module
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  await app.listen(port ?? 3000);
}
bootstrap();

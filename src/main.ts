import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any; // for hot reload

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // seeding
  // const seedService = app.get(SeedService);
  // await seedService.seed();

  // get the configuration from the config module
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  
  // enable hot reload for development mode
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Music API')
    .setDescription('The music API description')
    .setVersion('1.0')
    .addTag('music')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter JWT token',
      },
      'JWT-auth', // name of the auth scheme
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port ?? 3000);

}
bootstrap();

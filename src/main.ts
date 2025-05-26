import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_URL', '*'),
      configService.get<string>('ADMIN_URL', '*'),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips non-whitelisted properties
      transform: true, // transforms payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // throws an error when non-whitelisted properties are present
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Get port from environment or use default
  const port = configService.get<number>('PORT', 3002);

  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

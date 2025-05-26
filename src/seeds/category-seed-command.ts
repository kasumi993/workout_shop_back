import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { CategorySeedService } from './category-seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeedCategoriesCommand');

  try {
    logger.log('Starting categories seeding process...');

    const app = await NestFactory.createApplicationContext(SeedModule);
    const categorySeedService = app.get(CategorySeedService);

    await categorySeedService.seedSportsCategories();

    await app.close();
    logger.log('Categories seeding process completed successfully!');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error during categories seeding process: ${errorMessage}`);
    process.exit(1);
  }
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeedCommand');

  try {
    logger.log('Démarrage du processus de seed...');

    const app = await NestFactory.createApplicationContext(SeedModule);
    const seedService = app.get(SeedService);

    await seedService.seed();

    await app.close();
    logger.log('Processus de seed terminé avec succès!');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Erreur lors du processus de seed: ${errorMessage}`);
    process.exit(1);
  }
}

bootstrap();

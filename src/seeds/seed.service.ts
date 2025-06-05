import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async seed() {
    await this.seedCustomers();
    this.logger.log('Seed completed successfully!');
  }

  async seedCustomers() {
    const customerCount = await this.prisma.customer.count();

    if (customerCount === 0) {
      this.logger.log('Creating admin user...');

      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL') ||
        'khadijag993@gmail.com';
      const adminPassword =
        this.configService.get<string>('ADMIN_PASSWORD') || 'admin';

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await this.prisma.customer.create({
        data: {
          name: 'Admin User',
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true,
          googleId: null,
        },
      });

      this.logger.log('Admin user created successfully!');
    } else {
      this.logger.log(`${customerCount} users already exist, skipping.`);
    }
  }

  async seedProducts() {
    const productCount = await this.prisma.product.count();

    if (productCount === 0) {
      this.logger.log('Creating products...');

      // Get categories
      const freeWeights = await this.prisma.category.findFirst({
        where: { name: 'Poids libres' },
      });

      const cardioEquipment = await this.prisma.category.findFirst({
        where: { name: 'Équipement cardio' },
      });

      const yogaAndPilates = await this.prisma.category.findFirst({
        where: { name: 'Yoga et Pilates' },
      });

      // Create products only if categories exist
      if (freeWeights) {
        await this.prisma.product.createMany({
          data: [
            {
              title: 'Haltères en fonte 5kg (paire)',
              description:
                "Paire d'haltères en fonte de 5kg pour l'entraînement de force.",
              price: 29.99,
              categoryId: freeWeights.id,
              properties: {
                matériau: 'fonte',
                poids_kg: '5',
                couleur: 'noir',
              },
            },
            {
              title: 'Kettlebell en fonte 10kg',
              description:
                'Kettlebell en fonte de qualité pour des exercices polyvalents.',
              price: 45.99,
              categoryId: freeWeights.id,
              properties: {
                matériau: 'fonte',
                poids_kg: '10',
                couleur: 'noir',
              },
            },
          ],
        });
      }

      if (cardioEquipment) {
        await this.prisma.product.createMany({
          data: [
            {
              title: 'Tapis de course pliable',
              description:
                "Tapis de course compact et pliable pour l'entraînement à domicile.",
              price: 499.99,
              categoryId: cardioEquipment.id,
              properties: {
                type: 'tapis de course',
                niveau: 'intermédiaire',
                couleur: 'noir',
              },
            },
            {
              title: "Vélo d'appartement",
              description:
                "Vélo d'appartement avec résistance magnétique et écran LCD.",
              price: 299.99,
              categoryId: cardioEquipment.id,
              properties: {
                type: 'vélo',
                niveau: 'débutant',
                couleur: 'gris',
              },
            },
          ],
        });
      }

      if (yogaAndPilates) {
        await this.prisma.product.createMany({
          data: [
            {
              title: 'Tapis de yoga premium',
              description:
                'Tapis de yoga antidérapant et écologique pour la pratique quotidienne.',
              price: 49.99,
              categoryId: yogaAndPilates.id,
              properties: {
                matériau: 'TPE',
                épaisseur: '6mm',
                couleur: 'bleu',
              },
            },
            {
              title: 'Ballon de Pilates 65cm',
              description:
                "Ballon d'exercice pour Pilates et fitness, renforce le core et améliore l'équilibre.",
              price: 24.99,
              categoryId: yogaAndPilates.id,
              properties: {
                matériau: 'PVC',
                couleur: 'rouge',
              },
            },
          ],
        });
      }

      this.logger.log('Products created successfully!');
    } else {
      this.logger.log(`${productCount} products already exist, skipping.`);
    }
  }
}

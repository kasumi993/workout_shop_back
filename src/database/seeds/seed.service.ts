import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedProducts();
    this.logger.log('Seed terminé avec succès!');
  }

  async seedUsers() {
    const userCount = await this.userRepository.count();

    if (userCount === 0) {
      this.logger.log("Création de l'utilisateur admin...");

      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL') ||
        'khadijag993@gmail.com';
      const adminPassword =
        this.configService.get<string>('ADMIN_PASSWORD') || 'admin';

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await this.userRepository.save({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      this.logger.log('Utilisateur admin créé avec succès!');
    } else {
      this.logger.log(`${userCount} utilisateurs existent déjà, ignoré.`);
    }
  }

  async seedCategories() {
    const categoryCount = await this.categoryRepository.count();

    if (categoryCount === 0) {
      this.logger.log('Création des catégories...');

      // Catégorie principale: Workout Equipment
      const workoutEquipment = await this.categoryRepository.save({
        name: "Équipement d'entraînement",
        properties: [
          { name: 'couleur', values: ['noir', 'bleu', 'rouge', 'gris'] },
          { name: 'poids', values: ['léger', 'moyen', 'lourd'] },
        ],
      });

      // Sous-catégories
      await this.categoryRepository.save([
        {
          name: 'Poids libres',
          parent: workoutEquipment,
          properties: [
            { name: 'matériau', values: ['fonte', 'caoutchouc', 'vinyle'] },
            { name: 'poids_kg', values: ['2', '5', '10', '15', '20'] },
          ],
        },
        {
          name: 'Équipement cardio',
          parent: workoutEquipment,
          properties: [
            {
              name: 'type',
              values: ['tapis de course', 'vélo', 'elliptique', 'rameur'],
            },
            { name: 'niveau', values: ['débutant', 'intermédiaire', 'avancé'] },
          ],
        },
        {
          name: 'Yoga et Pilates',
          parent: workoutEquipment,
          properties: [
            { name: 'matériau', values: ['PVC', 'caoutchouc naturel', 'TPE'] },
            { name: 'épaisseur', values: ['4mm', '6mm', '8mm'] },
          ],
        },
      ]);

      this.logger.log('Catégories créées avec succès!');
    } else {
      this.logger.log(`${categoryCount} catégories existent déjà, ignoré.`);
    }
  }

  async seedProducts() {
    const productCount = await this.productRepository.count();

    if (productCount === 0) {
      this.logger.log('Création des produits...');

      // Récupérer les catégories
      const freeWeights = await this.categoryRepository.findOne({
        where: { name: 'Poids libres' },
      });

      const cardioEquipment = await this.categoryRepository.findOne({
        where: { name: 'Équipement cardio' },
      });

      const yogaAndPilates = await this.categoryRepository.findOne({
        where: { name: 'Yoga et Pilates' },
      });

      // Créer les produits uniquement si les catégories existent
      if (freeWeights) {
        await this.productRepository.save([
          {
            title: 'Haltères en fonte 5kg (paire)',
            description:
              "Paire d'haltères en fonte de 5kg pour l'entraînement de force.",
            price: 29.99,
            images: [],
            category: freeWeights,
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
            images: [],
            category: freeWeights,
            properties: {
              matériau: 'fonte',
              poids_kg: '10',
              couleur: 'noir',
            },
          },
        ]);
      }

      if (cardioEquipment) {
        await this.productRepository.save([
          {
            title: 'Tapis de course pliable',
            description:
              "Tapis de course compact et pliable pour l'entraînement à domicile.",
            price: 499.99,
            images: [],
            category: cardioEquipment,
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
            images: [],
            category: cardioEquipment,
            properties: {
              type: 'vélo',
              niveau: 'débutant',
              couleur: 'gris',
            },
          },
        ]);
      }

      if (yogaAndPilates) {
        await this.productRepository.save([
          {
            title: 'Tapis de yoga premium',
            description:
              'Tapis de yoga antidérapant et écologique pour la pratique quotidienne.',
            price: 49.99,
            images: [],
            category: yogaAndPilates,
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
            images: [],
            category: yogaAndPilates,
            properties: {
              matériau: 'PVC',
              couleur: 'rouge',
            },
          },
        ]);
      }

      this.logger.log('Produits créés avec succès!');
    } else {
      this.logger.log(`${productCount} produits existent déjà, ignoré.`);
    }
  }
}

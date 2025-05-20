import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import * as bcrypt from 'bcrypt';

// Load environment variables
config();
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Product, Category],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations_history',
});

// This function runs migrations and creates initial admin user
async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized');

    // Run migrations
    await AppDataSource.runMigrations();
    console.log('Migrations have been run successfully');

    // Create admin user if it doesn't exist
    const userRepository = AppDataSource.getRepository(User);
    const adminEmail = configService.get<string>('ADMIN_EMAIL');
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        configService.get('ADMIN_PASSWORD') || 'admin',
        10,
      );

      await userRepository.save({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    await AppDataSource.destroy();
    console.log('Data Source has been closed');
  } catch (error) {
    console.error('Error during migration process', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

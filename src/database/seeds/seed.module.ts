import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { UsersModule } from '../../users/users.module';
import { CategoriesModule } from '../../categories/categories.module';
import { ProductsModule } from '../../products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD');
        if (!password) {
          throw new Error('Missing required environment variable: DB_PASSWORD');
        }

        const database = configService.get<string>('DB_DATABASE');
        if (!database) {
          throw new Error('Missing required environment variable: DB_DATABASE');
        }
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password,
          database,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') !== 'production', // Don't use in production!
        };
      },
    }),
    TypeOrmModule.forFeature([User, Category, Product]),
    UsersModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

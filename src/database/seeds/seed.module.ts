import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { UsersModule } from '../../users/users.module';
import { CategoriesModule } from '../../categories/categories.module';
import { ProductsModule } from '../../products/products.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Category, Product]),
    UsersModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

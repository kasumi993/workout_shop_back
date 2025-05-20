import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
      images: createProductDto.images || [],
      properties: createProductDto.properties || {},
    });

    // Set category if provided
    if (createProductDto.categoryId) {
      product.category = await this.categoriesService.findOne(
        createProductDto.categoryId,
      );
    }

    return this.productsRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Update basic properties
    if (updateProductDto.title !== undefined) {
      product.title = updateProductDto.title;
    }

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }

    if (updateProductDto.images !== undefined) {
      product.images = updateProductDto.images;
    }

    if (updateProductDto.properties !== undefined) {
      product.properties = updateProductDto.properties;
    }

    // Update category if provided
    if (updateProductDto.categoryId !== undefined) {
      if (updateProductDto.categoryId) {
        product.category = await this.categoriesService.findOne(
          updateProductDto.categoryId,
        );
      } else {
        product.category = null;
      }
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}

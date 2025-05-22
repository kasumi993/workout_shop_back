import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { title, description, price, images, categoryId, properties } =
      createProductDto;

    return this.prisma.product.create({
      data: {
        title,
        description,
        price,
        images: images || [],
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        properties: properties || {},
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Verify product exists
    await this.findOne(id);

    const { title, description, price, images, categoryId, properties } =
      updateProductDto;

    const data: Prisma.ProductUpdateInput = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (images !== undefined) data.images = images;
    if (properties !== undefined) data.properties = properties;

    if (categoryId !== undefined) {
      data.category = categoryId
        ? { connect: { id: categoryId } }
        : { disconnect: true };
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Verify product exists
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });
  }
}

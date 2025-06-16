import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductsResponse } from './interfaces/product.interfaces';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetProductsDto): Promise<ProductsResponse> {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'featured',
      cursor = false,
      lastId,
    } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      AND: [
        // Search filter
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},

        // Category filter
        category && category !== 'all'
          ? {
              OR: [
                { category: { id: category } },
                {
                  category: {
                    name: {
                      equals: category,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
                {
                  category: {
                    parent: {
                      name: {
                        equals: category,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              ],
            }
          : {},

        // Price range filter
        minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { title: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // For cursor-based pagination (infinite scroll)
    if (cursor && lastId) {
      where.id = { gt: lastId };
    }

    // Get total count for pagination
    const total = await this.prisma.product.count({ where });

    // Calculate pagination
    const skip = cursor ? 0 : (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    // Fetch products
    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Get filter data (categories and price range) only on first page or when no filters applied
    let filters: { categories; priceRange } | undefined = undefined;
    if (page === 1 && !cursor) {
      const [categories, priceStats] = await Promise.all([
        this.prisma.category.findMany({
          where: {
            products: { some: {} },
          },
          include: {
            _count: {
              select: { products: true },
            },
            parent: true,
          },
        }),
        this.prisma.product.aggregate({
          _min: { price: true },
          _max: { price: true },
        }),
      ]);

      filters = {
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          count: cat._count.products,
          parentName: cat.parent?.name,
        })),
        priceRange: {
          min: Number(priceStats._min.price) || 0,
          max: Number(priceStats._max.price) || 100000,
        },
      };
    }

    return {
      products,
      pagination: {
        total,
        page: cursor ? 1 : page,
        limit,
        pages,
        hasNext: cursor ? products.length === limit : page < pages,
        hasPrev: cursor ? false : page > 1,
      },
      filters,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async getRelatedProducts(
    productId: string,
    limit: number = 4,
  ): Promise<Product[]> {
    const product = await this.findOne(productId);

    return this.prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          {
            OR: [
              { categoryId: product.categoryId },
              {
                price: {
                  gte: Number(product.price) * 0.7,
                  lte: Number(product.price) * 1.3,
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
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

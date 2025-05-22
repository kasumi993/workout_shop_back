import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parentId, properties } = createCategoryDto;

    return this.prisma.category.create({
      data: {
        name,
        parentId,
        properties: properties || [],
      },
      include: {
        parent: true,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Verify category exists
    await this.findOne(id);

    const { name, parentId, properties } = updateCategoryDto;

    // Build the data object dynamically
    const data: Prisma.CategoryUpdateInput = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (properties !== undefined) {
      data.properties = properties;
    }

    if (parentId !== undefined) {
      if (parentId) {
        data.parent = { connect: { id: parentId } };
      } else {
        data.parent = { disconnect: true };
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string) {
    // Verify category exists
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });
  }
}

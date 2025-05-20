import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      properties: createCategoryDto.properties || [],
    });

    // Set parent if provided
    if (createCategoryDto.parentId) {
      const parent = await this.findOne(createCategoryDto.parentId);
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Update basic properties
    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.properties) {
      category.properties = updateCategoryDto.properties;
    }

    // Update parent relationship if provided
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId) {
        const parent = await this.findOne(updateCategoryDto.parentId);
        category.parent = parent;
      } else {
        category.parent = null;
      }
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}

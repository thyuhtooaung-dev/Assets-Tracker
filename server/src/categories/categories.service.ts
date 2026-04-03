import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

const CATEGORY_RELATIONS = ['assets'] as const;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);

    return this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return this.categoryRepository.find({
      relations: [...CATEGORY_RELATIONS],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: [...CATEGORY_RELATIONS],
    });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    const updatedCategory: Category = {
      ...category,
      ...updateCategoryDto,
    };

    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);

    return { message: `Category with id "${id}" deleted successfully` };
  }
}

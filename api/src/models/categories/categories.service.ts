import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { Category } from './Category';
import { CreateCategoryInputs } from './inputs/create-category-inputs';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, parentId }: CreateCategoryInputs): Promise<Category> {
    const nameAlreadyExist = await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (nameAlreadyExist) {
      throw new BadRequestException('Name already exist');
    }
    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: {
          id: parentId,
        },
      });
      if (!parent) {
        throw new BadRequestException('Invalid parent ID');
      }
    }
    return this.prisma.category.create({
      data: {
        name,
        parentId,
      },
    });
  }
  find(parentId?: number): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        parentId: parentId ?? null,
      },
    });
  }
}

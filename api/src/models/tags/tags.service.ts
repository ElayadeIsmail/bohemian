import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PAGINATION_LIMIT_MAX } from 'src/common/constants';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { IPagination } from 'src/common/types/pagination';
import { FindManyTagsInputs } from './inputs/find-many-tags-args';
import { Tag } from './Tag';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: { name: string }): Promise<Tag> {
    const nameAlreadyExist = await this.prisma.tag.findUnique({
      where: { name },
    });
    if (nameAlreadyExist) {
      throw new BadRequestException('Name already exist');
    }
    return this.prisma.tag.create({ data: { name } });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async find(findManyArgs: FindManyTagsInputs): Promise<IPagination<Tag>> {
    let cursor: Prisma.TagWhereUniqueInput;
    let skip: number;
    const limit = Math.min(findManyArgs.limit, PAGINATION_LIMIT_MAX);
    const limitPlusOne = limit + 1;
    if (findManyArgs.cursor) {
      cursor = {
        id: findManyArgs.cursor,
      };
      skip = 1;
    }
    const items = await this.prisma.tag.findMany({
      where: {
        name: {
          startsWith: findManyArgs.search.trim(),
          mode: 'insensitive',
        },
      },
      take: limitPlusOne,
      cursor,
      skip,
      orderBy: {
        id: 'desc',
      },
    });
    return {
      items: items.slice(0, limit),
      hasMore: items.length === limitPlusOne,
      cursor: items[items.length - 1].id,
    };
  }
  async update(id: number, name: string): Promise<Tag> {
    const [tag, newNameAlreadyExist] = await Promise.all([
      this.prisma.tag.findMany({ where: { id } }),
      this.prisma.tag.findFirst({
        where: {
          name,
          id: {
            not: { equals: id },
          },
        },
      }),
    ]);
    if (!tag) {
      throw new BadRequestException('tag not found');
    }
    if (newNameAlreadyExist) {
      throw new BadRequestException('New Name already exist');
    }
    return this.prisma.tag.update({ where: { id }, data: { name } });
  }
  async remove(id: number): Promise<Tag> {
    // TODO Check if tag still connected with products
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new BadRequestException('tag not found');
    }
    return this.prisma.tag.delete({ where: { id } });
  }
}

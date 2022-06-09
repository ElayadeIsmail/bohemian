import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    const limitPlusOne = findManyArgs.limit + 1;
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
      items: items.slice(0, findManyArgs.limit),
      hasMore: items.length === limitPlusOne,
      cursor: items[items.length - 1].id,
    };
  }
}

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
    // check if name already exist
    const nameAlreadyExist = await this.prisma.tag.findUnique({
      where: { name },
    });
    // return 400 if name already exist
    if (nameAlreadyExist) {
      throw new BadRequestException('Name already exist');
    }
    // create new record and return it
    return this.prisma.tag.create({ data: { name } });
  }

  async findOne(id: number): Promise<Tag> {
    //   find tag by ID
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    // return 404 if tag not found
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    // return 200 and record
    return tag;
  }

  async find(findManyArgs: FindManyTagsInputs): Promise<IPagination<Tag>> {
    let cursor: Prisma.TagWhereUniqueInput;
    let skip: number;
    // make sure limit is less than PAGINATION_LIMIT_MAX = 50
    const limit = Math.min(findManyArgs.limit, PAGINATION_LIMIT_MAX);
    // add one to limit so we can check if there is more
    // items in the database for another request
    const limitPlusOne = limit + 1;
    // check if cursor not null
    if (findManyArgs.cursor) {
      cursor = {
        id: findManyArgs.cursor,
      };
      skip = 1;
    }
    // get items sorted by id DESC
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
    // return items with less item
    // because we added one to check if there is more items
    // for another pagination
    return {
      items: items.slice(0, limit),
      hasMore: items.length === limitPlusOne,
      cursor: items[items.length - 1].id,
    };
  }
  async update(id: number, name: string): Promise<Tag> {
    //   get item by ID
    // and check if there is another item with the new name
    // that we're trying to insert
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
    // return 400 if there is no item
    if (!tag) {
      throw new BadRequestException('tag not found');
    }
    // return 400 if the new name already taken by another tag
    if (newNameAlreadyExist) {
      throw new BadRequestException('New Name already exist');
    }
    // update name of tag and return the updated item
    return this.prisma.tag.update({ where: { id }, data: { name } });
  }
  async remove(id: number): Promise<Tag> {
    // TODO Check if tag still connected with products
    // get item by ID
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    // return 400 if item does not exist
    if (!tag) {
      throw new BadRequestException('tag not found');
    }
    // delete item and return it
    return this.prisma.tag.delete({ where: { id } });
  }
}

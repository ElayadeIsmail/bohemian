import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PAGINATION_LIMIT_MAX } from 'src/common/constants';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { IPagination } from 'src/common/types/pagination';
import { CreatePromotionInputs } from './inputs/create-promotion-inputs';
import { FindManyPromotionsInputs } from './inputs/find-many-promotion-inputs';
import { UpdatePromotionInputs } from './inputs/update-promotion-inputs';
import { Promotion } from './Promotion';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(inputs: CreatePromotionInputs): Promise<Promotion> {
    const nameExists = await this.prisma.promotion.findUnique({
      where: { name: inputs.name },
    });
    if (nameExists) {
      throw new BadRequestException('Name already exist');
    }
    return this.prisma.promotion.create({
      data: inputs,
    });
  }

  async findOne(id: number): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });
    if (!promotion) {
      throw new BadRequestException('promotion not found');
    }
    // TODO check if there is a product still associated with
    // promo
    return promotion;
  }

  async find(
    findManyArgs: FindManyPromotionsInputs,
  ): Promise<IPagination<Promotion>> {
    let cursor: Prisma.PromotionWhereUniqueInput;
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
    const items = await this.prisma.promotion.findMany({
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
  async update(id: number, body: UpdatePromotionInputs): Promise<Promotion> {
    const [promotion, newNameExists] = await Promise.all([
      this.prisma.promotion.findUnique({
        where: {
          id,
        },
      }),
      this.prisma.promotion.findFirst({
        where: {
          name: body.name,
          id: {
            not: {
              equals: id,
            },
          },
        },
      }),
    ]);
    if (!promotion) {
      throw new BadRequestException('Promotion does not exist');
    }
    if (newNameExists) {
      throw new BadRequestException('Name already exist');
    }
    return this.prisma.promotion.update({ where: { id }, data: body });
  }
  async remove(id: number): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });
    if (!promotion) {
      throw new BadRequestException('promotion not found');
    }
    // TODO check if there is a product still associated with
    // promo
    return this.prisma.promotion.delete({ where: { id } });
  }
}

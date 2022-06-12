import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { Collection } from './Collection';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string): Promise<Collection> {
    const slug = slugify(title, { lower: true, strict: true });
    const alreadyExist = await this.prisma.collection.findUnique({
      where: { slug },
    });
    if (alreadyExist) {
      throw new BadRequestException('title already exist');
    }
    // TODO add upload cover photo
    return this.prisma.collection.create({
      data: {
        title,
        slug,
        cover: 'will-change',
      },
    });
  }

  async findOne(slug: string): Promise<Collection> {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
    });
    if (!collection) {
      throw new NotFoundException();
    }
    return collection;
  }

  find(): Promise<Collection[]> {
    return this.prisma.collection.findMany({});
  }

  async update(id: number, title: string): Promise<Collection> {
    const newSlug = slugify(title, { lower: true, strict: true });
    const [collection, slugExist] = await Promise.all([
      this.prisma.collection.findUnique({ where: { id } }),
      this.prisma.collection.findFirst({
        where: {
          id: {
            not: { equals: id },
          },
          slug: newSlug,
        },
      }),
    ]);
    if (!collection) {
      throw new BadRequestException('there is no collection with this ID');
    }
    if (slugExist) {
      throw new BadRequestException('Invalid title');
    }
    return this.prisma.collection.update({
      where: { id },
      data: { slug: newSlug, title },
    });
  }

  async remove(id: number): Promise<Collection> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });
    if (!collection) {
      throw new BadRequestException();
    }
    return this.prisma.collection.delete({ where: { id } });
  }
}

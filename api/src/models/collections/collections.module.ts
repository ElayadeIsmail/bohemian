import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';

@Module({
  providers: [CollectionsResolver, CollectionsService, PrismaService],
})
export class CollectionsModule {}

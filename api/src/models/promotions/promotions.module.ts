import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { PromotionsResolver } from './promotions.resolver';
import { PromotionsService } from './promotions.service';

@Module({
  providers: [PromotionsResolver, PromotionsService, PrismaService],
})
export class PromotionsModule {}

import { Resolver } from '@nestjs/graphql';
import { PromotionsService } from './promotions.service';

@Resolver()
export class PromotionsResolver {
  constructor(private readonly promotionsService: PromotionsService) {}
}

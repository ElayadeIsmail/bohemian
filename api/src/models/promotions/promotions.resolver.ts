import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { IPagination } from 'src/common/types/pagination';
import { CreatePromotionInputs } from './inputs/create-promotion-inputs';
import { FindManyPromotionsInputs } from './inputs/find-many-promotion-inputs';
import { UpdatePromotionInputs } from './inputs/update-promotion-inputs';
import { Promotion } from './Promotion';
import { PromotionsService } from './promotions.service';

@ObjectType()
class FindManyPromotionsResponse {
  @Field(() => Int, { nullable: true })
  cursor: number;
  @Field()
  hasMore: boolean;
  @Field(() => [Promotion])
  items: Promotion[];
}

@Resolver(() => Promotion)
export class PromotionsResolver {
  constructor(private readonly promotionsService: PromotionsService) {}
  @Query(() => FindManyPromotionsResponse)
  promotions(
    @Args('args') args: FindManyPromotionsInputs,
  ): Promise<IPagination<Promotion>> {
    return this.promotionsService.find(args);
  }

  @Query(() => Promotion)
  promotion(@Args('id', { type: () => Int }) id: number): Promise<Promotion> {
    return this.promotionsService.findOne(id);
  }

  @Mutation(() => Promotion)
  addPromotion(
    @Args('inputs') inputs: CreatePromotionInputs,
  ): Promise<Promotion> {
    return this.promotionsService.create(inputs);
  }

  @Mutation(() => Promotion)
  updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('inputs') inputs: UpdatePromotionInputs,
  ): Promise<Promotion> {
    return this.promotionsService.update(id, inputs);
  }

  @Mutation(() => Promotion)
  deleteTag(@Args('id', { type: () => Int }) id: number): Promise<Promotion> {
    return this.promotionsService.remove(id);
  }
}

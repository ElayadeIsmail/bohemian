import { Field, InputType, Int } from '@nestjs/graphql';
import { PAGINATION_LIMIT } from '../constants';

@InputType()
export class BasePaginationInputs {
  @Field(() => Int, { nullable: true })
  cursor: number;
  @Field(() => Int, { nullable: true, defaultValue: PAGINATION_LIMIT })
  limit: number;
  @Field({ nullable: true, defaultValue: '' })
  search: string;
}

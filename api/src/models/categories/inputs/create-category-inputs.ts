import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInputs {
  @Field()
  name: string;
  @Field(() => Int, { nullable: true })
  parentId?: number;
}

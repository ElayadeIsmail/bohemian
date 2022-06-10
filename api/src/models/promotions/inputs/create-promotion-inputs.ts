import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePromotionInputs {
  @Field()
  name: string;
  @Field({ nullable: true })
  description: string;
  @Field()
  discount: number;
}

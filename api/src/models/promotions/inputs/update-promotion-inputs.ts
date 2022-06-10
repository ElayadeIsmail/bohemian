import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePromotionInputs {
  @Field()
  name: string;
  @Field({ nullable: true, defaultValue: '' })
  description: string;
  @Field(() => Float)
  discount: number;
}

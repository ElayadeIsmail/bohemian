import { Field, Int } from '@nestjs/graphql';

export class Promotion {
  @Field(() => Int)
  id: number;
  @Field()
  name: string;
  @Field()
  discount: number;
  @Field({ nullable: true })
  description?: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Collection {
  @Field(() => Int)
  id: number;
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field()
  cover: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

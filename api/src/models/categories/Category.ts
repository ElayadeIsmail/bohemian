import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;
  @Field()
  name: string;
  @Field(() => Int, { nullable: true })
  parentId?: number;
  @Field(() => [Category], { nullable: true })
  children?: Category[];
}

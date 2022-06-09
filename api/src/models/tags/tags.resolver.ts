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
import { FindManyTagsInputs } from './inputs/find-many-tags-args';
import { Tag } from './Tag';
import { TagsService } from './tags.service';

@ObjectType()
class FindManyTagsResponse {
  @Field(() => Int, { nullable: true })
  cursor: number;
  @Field()
  hasMore: boolean;
  @Field(() => [Tag])
  items: Tag[];
}

@Resolver()
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => FindManyTagsResponse)
  tags(@Args('args') args: FindManyTagsInputs): Promise<IPagination<Tag>> {
    return this.tagsService.find(args);
  }
  @Query(() => Tag)
  tag(@Args('id', { type: () => Int }) id: number): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Mutation(() => Tag)
  addTag(@Args('name') name: string): Promise<Tag> {
    return this.tagsService.create({ name });
  }
  @Mutation(() => Tag)
  updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ): Promise<Tag> {
    return this.tagsService.update(id, name);
  }
  @Mutation(() => Tag)
  deleteTag(@Args('id', { type: () => Int }) id: number): Promise<Tag> {
    return this.tagsService.remove(id);
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Collection } from './Collection';
import { CollectionsService } from './collections.service';

@Resolver()
export class CollectionsResolver {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Query(() => Collection)
  async collection(@Args('slug') slug: string) {
    return this.collectionsService.findOne(slug);
  }

  @Query(() => [Collection])
  async collections() {
    return this.collectionsService.find();
  }

  @Mutation(() => Collection)
  async addCollection(@Args('title') title: string) {
    return this.collectionsService.create(title);
  }

  @Mutation(() => Collection)
  async updateCollection(@Args('id') id: number, @Args('title') title: string) {
    return this.collectionsService.update(id, title);
  }

  @Mutation(() => Collection)
  async deleteCollection(@Args('id') id: number) {
    return this.collectionsService.remove(id);
  }
}

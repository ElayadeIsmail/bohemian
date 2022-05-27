import { Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entity/Category';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}
}

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CategoriesModule } from './models/categories/categories.module';
import { TagsModule } from './models/tags/tags.module';
import { PromotionsModule } from './models/promotions/promotions.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CategoriesModule,
    TagsModule,
    PromotionsModule,
  ],
})
export class AppModule {}

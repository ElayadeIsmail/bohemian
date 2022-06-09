import { InputType } from '@nestjs/graphql';
import { BasePaginationInputs } from 'src/common/inputs/base-pagination-inputs';

@InputType()
export class FindManyTagsInputs extends BasePaginationInputs {}

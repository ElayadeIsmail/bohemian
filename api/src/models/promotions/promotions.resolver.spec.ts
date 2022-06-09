import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsResolver } from './promotions.resolver';
import { PromotionsService } from './promotions.service';

describe('PromotionsResolver', () => {
  let resolver: PromotionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionsResolver, PromotionsService],
    }).compile();

    resolver = module.get<PromotionsResolver>(PromotionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

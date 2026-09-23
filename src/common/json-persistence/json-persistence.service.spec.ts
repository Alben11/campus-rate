import { Test, TestingModule } from '@nestjs/testing';
import { JsonPersistenceService } from './json-persistence.service';

describe('JsonPersistenceService', () => {
  let service: JsonPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonPersistenceService],
    }).compile();

    service = module.get<JsonPersistenceService>(JsonPersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

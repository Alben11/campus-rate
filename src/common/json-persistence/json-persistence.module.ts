import { Module } from '@nestjs/common';
import { JsonPersistenceService } from './json-persistence.service';

@Module({
  providers: [JsonPersistenceService],
  exports: [JsonPersistenceService], // Permet à d'autres modules (Places, Reviews) d'injecter ce service
})
export class JsonPersistenceModule {}
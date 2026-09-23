import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { JsonPersistenceModule } from '../common/json-persistence/json-persistence.module';

@Module({
  imports: [JsonPersistenceModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
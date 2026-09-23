import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { JsonPersistenceModule } from '../common/json-persistence/json-persistence.module';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [JsonPersistenceModule, PlacesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
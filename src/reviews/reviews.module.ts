import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]), PlacesModule,],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService, MongooseModule],
})
export class ReviewsModule {}
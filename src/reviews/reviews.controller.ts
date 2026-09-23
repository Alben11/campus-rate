import {Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query,} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query('placeId') placeId?: string): Promise<Review[]> {
    if (placeId) {
      return this.reviewsService.findByPlace(placeId);
    }
    return this.reviewsService.findAll();
  }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(id);
  }
}
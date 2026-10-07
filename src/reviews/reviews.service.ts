import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { PlacesService } from '../places/places.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    private readonly placesService: PlacesService,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    // Vérifie que le lieu existe dans MongoDB Atlas
    await this.placesService.findOne(placeId);

    return this.reviewModel.find({ placeId }).exec();
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Vérifie que le lieu existe avant de créer l'avis
    await this.placesService.findOne(createReviewDto.placeId);

    const newReview = new this.reviewModel(createReviewDto);
    return newReview.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`L'avis avec l'ID "${id}" n'existe pas.`);
    }
  }
}
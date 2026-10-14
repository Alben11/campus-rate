import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { PlacesService } from '../places/places.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Types } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    private readonly placesService: PlacesService,
  ) {}

  // (M2): Agrégation MongoDB pour calculer les statistiques d'un lieu ---
  async getStatsForPlace(placeId: string) {
    const stats = await this.reviewModel.aggregate([
      {
        $match: { placeId: new Types.ObjectId(placeId) },
      },
      {
        $group: {
          _id: '$placeId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (!stats || stats.length === 0) {
      return { placeId, averageRating: 0, totalReviews: 0 };
    }

    return {
      placeId: stats[0]._id,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    };
  }

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
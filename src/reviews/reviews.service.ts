import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonPersistenceService } from '../common/json-persistence/json-persistence.service';
import { PlacesService } from '../places/places.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewsService {
  private readonly fileName = 'reviews.json';

  constructor(
    private readonly jsonPersistenceService: JsonPersistenceService,
    private readonly placesService: PlacesService,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.jsonPersistenceService.readData<Review>(this.fileName);
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    // Vérifie d'abord si l'endroit existe
    await this.placesService.findOne(placeId);
    
    const reviews = await this.findAll();
    return reviews.filter((r) => r.placeId === placeId);
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Vérifie que l'endroit existe avant d'ajouter l'avis
    await this.placesService.findOne(createReviewDto.placeId);

    const reviews = await this.findAll();
    const newReview: Review = {
      id: randomUUID(),
      placeId: createReviewDto.placeId,
      author: createReviewDto.author,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await this.jsonPersistenceService.writeData(this.fileName, reviews);
    return newReview;
  }

  async remove(id: string): Promise<void> {
    const reviews = await this.findAll();
    const index = reviews.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new NotFoundException(`L'avis avec l'ID "${id}" n'existe pas.`);
    }

    reviews.splice(index, 1);
    await this.jsonPersistenceService.writeData(this.fileName, reviews);
  }
}
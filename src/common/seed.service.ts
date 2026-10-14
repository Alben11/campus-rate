import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from '../places/schemas/place.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    const placesCount = await this.placeModel.countDocuments();
    if (placesCount > 0) {
      this.logger.log(`Base de données déjà initialisée (${placesCount} lieux existants).`);
      return;
    }

    const placesPath = path.resolve(process.cwd(), './data/places.json');
    const reviewsPath = path.resolve(process.cwd(), './data/reviews.json');

    if (!fs.existsSync(placesPath) || !fs.existsSync(reviewsPath)) {
      this.logger.warn(`Fichiers de seed introuvables.`);
      return;
    }

    try {
      const placesRaw = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
      const reviewsRaw = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));

      // Map pour associer l'ancien UUID string au nouvel ObjectId créé par Mongoose
      const idMapping = new Map<string, any>();

      // 1. Insertion des lieux et enregistrement du mapping d'ID
      for (const placeData of placesRaw) {
        const { id, ...rest } = placeData;
        const createdPlace = await this.placeModel.create(rest);
        if (id) {
          idMapping.set(id, createdPlace._id);
        }
      }
      this.logger.log(`${placesRaw.length} lieux ont été importés avec succès.`);

      // 2. Substitution de placeId par le vrai ObjectId avant insertion des avis
      const reviewsToInsert = reviewsRaw.map((reviewData: any) => {
        const { id, placeId, ...rest } = reviewData;
        const mappedPlaceId = idMapping.get(placeId) || placeId;
        return {
          ...rest,
          placeId: mappedPlaceId,
        };
      });

      await this.reviewModel.insertMany(reviewsToInsert);
      this.logger.log(`${reviewsToInsert.length} avis ont été importés avec succès.`);

    } catch (error) {
      this.logger.error('Erreur lors de l’initialisation des données :', error);
    }
  }
}
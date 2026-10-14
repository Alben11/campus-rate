import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  //Indexation de placeId pour optimiser la recherche des avis par lieu ---
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Place', index: true})
  placeId: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
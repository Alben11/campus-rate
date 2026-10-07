import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlaceDocument = Place & Document;

@Schema({ timestamps: true })
export class Place {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  averageRating: number;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
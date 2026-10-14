import { IsInt, IsNotEmpty, IsString, IsMongoId, Max, Min } from 'class-validator';

export class CreateReviewDto {
 @IsMongoId()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
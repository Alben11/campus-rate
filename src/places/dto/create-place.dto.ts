import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
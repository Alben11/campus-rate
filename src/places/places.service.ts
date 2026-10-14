import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { GetPlacesFilterDto } from './dto/get-places-filter.dto';


@Injectable()
export class PlacesService {
  private readonly fileName = 'places.json';

  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
  ) {}

  async findAll(filterDto?: GetPlacesFilterDto): Promise<{ data: Place[]; total: number; page: number; limit: number }> {
    const filter: any = {};
    const page = Number(filterDto?.page) || 1;
    const limit = Number(filterDto?.limit) || 10;
    const skip = (page - 1) * limit;
    if (filterDto) {
      const { category, search } = filterDto;

      // Filtrage par catégorie
      if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      // Filtrage par recherche (nom ou description)
      if (search) {
        filter.$or = [
          { name: { $regex: search,$options: 'i' } },
          { description: { $regex: search,$options: 'i' } },
        ];
      }
    }

      // Pagination
      const [data, total] = await Promise.all([
      this.placeModel.find(filter).skip(skip).limit(limit).exec(),
      this.placeModel.countDocuments(filter).exec(),
    ]);

      return {
        data,
        total,
        page,
        limit,
      };
    }



  async findOne(id: string): Promise<Place> {
    const place = await this.placeModel.findById(id).exec();
    if (!place) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }
    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const createdPlace = new this.placeModel(createPlaceDto);
    return createdPlace.save();
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const updatedPlace = await this.placeModel
      .findByIdAndUpdate(id, updatePlaceDto, { new: true })
      .exec();

    if (!updatedPlace) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }

    return updatedPlace;
  }

  async remove(id: string): Promise<void> {
    const result = await this.placeModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }  
  }
}
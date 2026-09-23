import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonPersistenceService } from '../common/json-persistence/json-persistence.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { GetPlacesFilterDto } from './dto/get-places-filter.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PlacesService {
  private readonly fileName = 'places.json';

  constructor(
    private readonly jsonPersistenceService: JsonPersistenceService,
  ) {}

  async findAll(filterDto?: GetPlacesFilterDto): Promise<{ data: Place[]; total: number; page: number; limit: number }> {
    let places = await this.jsonPersistenceService.readData<Place>(this.fileName);

    if (filterDto) {
      const { category, search, page = 1, limit = 10 } = filterDto;

      // Filtrage par catégorie
      if (category) {
        places = places.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase(),
        );
      }

      // Filtrage par recherche (nom ou description)
      if (search) {
        const searchLower = search.toLowerCase();
        places = places.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower)),
        );
      }

      const total = places.length;

      // Pagination
      const startIndex = (page - 1) * limit;
      const paginatedPlaces = places.slice(startIndex, startIndex + limit);

      return {
        data: paginatedPlaces,
        total,
        page: Number(page),
        limit: Number(limit),
      };
    }

    return {
      data: places,
      total: places.length,
      page: 1,
      limit: places.length,
    };
  }

  async findOne(id: string): Promise<Place> {
    const { data: places } = await this.findAll();
    const place = places.find((p) => p.id === id);
    if (!place) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }
    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const { data: places } = await this.findAll();
    const newPlace: Place = {
      id: randomUUID(),
      ...createPlaceDto,
      createdAt: new Date().toISOString(),
    };

    places.push(newPlace);
    await this.jsonPersistenceService.writeData(this.fileName, places);
    return newPlace;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const { data: places } = await this.findAll();
    const index = places.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }

    const updatedPlace = {
      ...places[index],
      ...updatePlaceDto,
    };

    places[index] = updatedPlace;
    await this.jsonPersistenceService.writeData(this.fileName, places);
    return updatedPlace;
  }

  async remove(id: string): Promise<void> {
    const { data: places } = await this.findAll();
    const index = places.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }

    places.splice(index, 1);
    await this.jsonPersistenceService.writeData(this.fileName, places);
  }
}
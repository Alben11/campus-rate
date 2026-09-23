import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonPersistenceService } from '../common/json-persistence/json-persistence.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PlacesService {
  private readonly fileName = 'places.json';

  constructor(
    private readonly jsonPersistenceService: JsonPersistenceService,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.jsonPersistenceService.readData<Place>(this.fileName);
  }

  async findOne(id: string): Promise<Place> {
    const places = await this.findAll();
    const place = places.find((p) => p.id === id);
    if (!place) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }
    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const places = await this.findAll();
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
    const places = await this.findAll();
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
    const places = await this.findAll();
    const index = places.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`L'endroit avec l'ID "${id}" n'existe pas.`);
    }

    places.splice(index, 1);
    await this.jsonPersistenceService.writeData(this.fileName, places);
  }
}
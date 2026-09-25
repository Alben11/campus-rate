import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query,} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { GetPlacesFilterDto } from './dto/get-places-filter.dto';
import { Place } from './entities/place.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  findAll(@Query() filterDto: GetPlacesFilterDto) {
    return this.placesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Place> {
    return this.placesService.findOne(id);
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placesService.create(createPlaceDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.placesService.remove(id);
  }
}
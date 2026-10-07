import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, BadRequestException,} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { GetPlacesFilterDto } from './dto/get-places-filter.dto';
import { Place } from './schemas/place.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Types } from 'mongoose';


@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Format d'ID MongoDB invalide: ${id}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les endroits ou filtrer' })
  @ApiResponse({ status: 200, description: 'Liste des endroits récupérée avec succès.' })
  findAll(@Query() filterDto: GetPlacesFilterDto) {
    return this.placesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un endroit par son ID MongoDB' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du lieu' })
  @ApiResponse({ status: 200, description: 'Endroit trouvé.' })
  @ApiResponse({ status: 400, description: 'Format d ID MongoDB invalide.' })
  @ApiResponse({ status: 404, description: 'Endroit non trouvé.' })
  findOne(@Param('id') id: string): Promise<Place> {
    this.validateObjectId(id);
    return this.placesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel endroit' })
  @ApiResponse({ status: 201, description: 'Endroit créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou champs non autorisés.' })
  create(@Body() createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placesService.create(createPlaceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un endroit existant' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du lieu' })
  @ApiResponse({ status: 200, description: 'Endroit mis à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou tentative de modifier un champ protégé.' })
  @ApiResponse({ status: 404, description: 'Endroit non trouvé.' })
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place> {
    this.validateObjectId(id);
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un endroit' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du lieu' })
  @ApiResponse({ status: 204, description: 'Endroit supprimé avec succès.' })
  @ApiResponse({ status: 400, description: 'Format d ID MongoDB invalide.' })
  @ApiResponse({ status: 404, description: 'Endroit non trouvé.' })
  remove(@Param('id') id: string): Promise<void> {
    this.validateObjectId(id);
    return this.placesService.remove(id);
  }
}
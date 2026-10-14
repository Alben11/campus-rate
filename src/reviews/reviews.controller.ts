import {Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query, BadRequestException} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Types } from 'mongoose';


@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Format d'ID MongoDB invalide: ${id}`);
    }
  }

  // (M2): Endpoint d'agrégation des statistiques ---
  @Get('stats/:placeId')
  @ApiOperation({ summary: 'Obtenir les statistiques agrégées des avis pour un lieu' })
  async getStatsForPlace(@Param('placeId') placeId: string) {
    return this.reviewsService.getStatsForPlace(placeId);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les appréciations ou filtrer par lieu' })
  @ApiQuery({ name: 'placeId', required: false, description: 'ID MongoDB du lieu pour filtrer' })
  @ApiResponse({ status: 200, description: 'Liste des avis récupérée avec succès.' })
  findAll(@Query('placeId') placeId?: string): Promise<Review[]> {
    if (placeId) {
      this.validateObjectId(placeId);
      return this.reviewsService.findByPlace(placeId);
    }
    return this.reviewsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Publier une nouvelle appréciation' })
  @ApiResponse({ status: 201, description: 'Avis créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données de la requête invalides (note hors limites, ID invalide, etc.).' })
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une appréciation' })
  @ApiParam({ name: 'id', description: 'ID MongoDB de la revue' })
  @ApiResponse({ status: 204, description: 'Avis supprimé avec succès.' })
  @ApiResponse({ status: 400, description: 'Format d ID MongoDB invalide.' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé.' })
  remove(@Param('id') id: string): Promise<void> {
    this.validateObjectId(id);
    return this.reviewsService.remove(id);
  }
}
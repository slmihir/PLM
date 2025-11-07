import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TechPacksService } from './tech-packs.service';
import { CreateTechPackDto } from './dto/create-tech-pack.dto';
import { CreateSizeSpecDto } from './dto/create-size-spec.dto';

@Controller('api/products/:productId/tech-packs')
export class TechPacksController {
  constructor(private readonly techPacksService: TechPacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('productId') productId: string,
    @Body() createTechPackDto: CreateTechPackDto,
  ) {
    return this.techPacksService.create(productId, createTechPackDto);
  }

  @Get()
  findByProduct(@Param('productId') productId: string) {
    return this.techPacksService.findByProduct(productId);
  }

  @Get('pending-reviews/:techSpecId')
  getPendingReviews(@Param('techSpecId') techSpecId: string) {
    return this.techPacksService.getPendingReviews(techSpecId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techPacksService.findOne(id);
  }

  @Post(':id/generate-pdf')
  generatePdf(@Param('id') id: string) {
    return this.techPacksService.generatePdf(id);
  }

  @Post(':id/submit-for-review')
  submitForReview(@Param('id') id: string) {
    return this.techPacksService.submitForReview(id);
  }

  @Post(':id/approve')
  approveForPattern(@Param('id') id: string) {
    return this.techPacksService.approveForPattern(id);
  }

  @Post(':id/reject')
  rejectWithFeedback(
    @Param('id') id: string,
    @Body('feedback') feedback: string,
  ) {
    return this.techPacksService.rejectWithFeedback(id, feedback);
  }

  @Post(':productId/size-specs')
  @HttpCode(HttpStatus.CREATED)
  addSizeSpec(
    @Param('productId') productId: string,
    @Body() createSizeSpecDto: CreateSizeSpecDto,
  ) {
    return this.techPacksService.addSizeSpec(productId, createSizeSpecDto);
  }

  @Get(':productId/size-specs')
  getSizeSpecs(@Param('productId') productId: string) {
    return this.techPacksService.getSizeSpecs(productId);
  }
}


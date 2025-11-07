import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PrintsService } from './prints.service';
import { CreatePrintDto } from './dto/create-print.dto';

@Controller('api/universe/prints')
export class PrintsController {
  constructor(private readonly printsService: PrintsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPrintDto: CreatePrintDto) {
    return this.printsService.create(createPrintDto);
  }

  @Get()
  findAll() {
    return this.printsService.findAll();
  }

  @Get(':printId')
  findOne(@Param('printId') printId: string) {
    return this.printsService.findOne(printId);
  }

  @Patch(':printId/version')
  updateVersion(
    @Param('printId') printId: string,
    @Body('artworkFilePath') artworkFilePath: string,
  ) {
    return this.printsService.updateVersion(printId, artworkFilePath);
  }

  @Patch(':printId/availability')
  updateAvailability(
    @Param('printId') printId: string,
    @Body('availabilityStatus') availabilityStatus: 'available' | 'unavailable',
  ) {
    return this.printsService.updateAvailability(printId, availabilityStatus);
  }

  @Delete(':printId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('printId') printId: string) {
    return this.printsService.remove(printId);
  }
}


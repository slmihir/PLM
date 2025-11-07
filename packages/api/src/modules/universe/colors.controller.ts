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
  Query,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';

@Controller('api/universe/colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  findAll(@Query('season') season?: 'SS' | 'AW') {
    if (season) {
      return this.colorsService.findBySeason(season);
    }
    return this.colorsService.findAll();
  }

  @Get(':colorCode')
  findOne(@Param('colorCode') colorCode: string) {
    return this.colorsService.findOne(colorCode);
  }

  @Patch(':colorCode')
  update(
    @Param('colorCode') colorCode: string,
    @Body() updateData: Partial<CreateColorDto>,
  ) {
    return this.colorsService.update(colorCode, updateData);
  }

  @Delete(':colorCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('colorCode') colorCode: string) {
    return this.colorsService.remove(colorCode);
  }
}


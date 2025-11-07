import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrimsService } from './trims.service';
import { CreateTrimDto } from './dto/create-trim.dto';
import { UpdateTrimDto } from './dto/update-trim.dto';

@Controller('api/universe/trims')
export class TrimsController {
  constructor(private readonly trimsService: TrimsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrimDto: CreateTrimDto) {
    return this.trimsService.create(createTrimDto);
  }

  @Get()
  findAll() {
    return this.trimsService.findAll();
  }

  @Get(':trimCode')
  findOne(@Param('trimCode') trimCode: string) {
    return this.trimsService.findOne(trimCode);
  }

  @Patch(':trimCode')
  update(
    @Param('trimCode') trimCode: string,
    @Body() updateTrimDto: UpdateTrimDto,
  ) {
    return this.trimsService.update(trimCode, updateTrimDto);
  }

  @Delete(':trimCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('trimCode') trimCode: string) {
    return this.trimsService.remove(trimCode);
  }

  @Post(':trimCode/inventory')
  updateInventory(
    @Param('trimCode') trimCode: string,
    @Body('quantity') quantity: number,
  ) {
    return this.trimsService.updateInventory(trimCode, quantity);
  }
}


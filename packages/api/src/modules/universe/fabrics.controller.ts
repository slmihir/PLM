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
import { FabricsService } from './fabrics.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';

@Controller('api/universe/fabrics')
export class FabricsController {
  constructor(private readonly fabricsService: FabricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFabricDto: CreateFabricDto) {
    return this.fabricsService.create(createFabricDto);
  }

  @Get()
  findAll() {
    return this.fabricsService.findAll();
  }

  @Get(':fabricCode')
  findOne(@Param('fabricCode') fabricCode: string) {
    return this.fabricsService.findOne(fabricCode);
  }

  @Patch(':fabricCode')
  update(
    @Param('fabricCode') fabricCode: string,
    @Body() updateFabricDto: UpdateFabricDto,
  ) {
    return this.fabricsService.update(fabricCode, updateFabricDto);
  }

  @Delete(':fabricCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('fabricCode') fabricCode: string) {
    return this.fabricsService.remove(fabricCode);
  }

  @Post(':fabricCode/inventory')
  updateInventory(
    @Param('fabricCode') fabricCode: string,
    @Body('quantity') quantity: number,
  ) {
    return this.fabricsService.updateInventory(fabricCode, quantity);
  }
}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fabric } from '../../database/entities/fabric.entity';
import { Trim } from '../../database/entities/trim.entity';
import { Print } from '../../database/entities/print.entity';
import { Color } from '../../database/entities/color.entity';
import { FabricsController } from './fabrics.controller';
import { FabricsService } from './fabrics.service';
import { TrimsController } from './trims.controller';
import { TrimsService } from './trims.service';
import { PrintsController } from './prints.controller';
import { PrintsService } from './prints.service';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fabric, Trim, Print, Color]),
  ],
  controllers: [
    FabricsController,
    TrimsController,
    PrintsController,
    ColorsController,
    InventoryController,
  ],
  providers: [
    FabricsService,
    TrimsService,
    PrintsService,
    ColorsService,
    InventoryService,
  ],
  exports: [
    FabricsService,
    TrimsService,
    PrintsService,
    ColorsService,
    InventoryService,
  ],
})
export class UniverseModule {}


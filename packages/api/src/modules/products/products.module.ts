import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { ProductFabric } from '../../database/entities/product-fabric.entity';
import { ProductTrim } from '../../database/entities/product-trim.entity';
import { ProductSketch } from '../../database/entities/product-sketch.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsBulkService } from './products-bulk.service';
import { UniverseModule } from '../universe/universe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductFabric, ProductTrim, ProductSketch]),
    UniverseModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsBulkService],
  exports: [ProductsService, ProductsBulkService],
})
export class ProductsModule {}


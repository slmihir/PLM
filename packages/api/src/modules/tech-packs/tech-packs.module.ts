import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechPack } from '../../database/entities/tech-pack.entity';
import { SizeSpec } from '../../database/entities/size-spec.entity';
import { Product } from '../../database/entities/product.entity';
import { TechPacksController } from './tech-packs.controller';
import { TechPacksService } from './tech-packs.service';
import { TechPackPdfService } from './tech-pack-pdf.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechPack, SizeSpec, Product]),
    ProductsModule,
  ],
  controllers: [TechPacksController],
  providers: [TechPacksService, TechPackPdfService],
  exports: [TechPacksService, TechPackPdfService],
})
export class TechPacksModule {}


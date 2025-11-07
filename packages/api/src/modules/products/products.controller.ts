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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsBulkService } from './products-bulk.service';
import { CreateProductDto } from './dto/create-product.dto';
import { LinkFabricDto } from './dto/link-fabric.dto';
import { LinkTrimDto } from './dto/link-trim.dto';
import { BulkUploadDto } from './dto/bulk-upload.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsBulkService: ProductsBulkService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.productsService.update(id, updateData);
  }

  @Post(':id/fabrics')
  linkFabric(@Param('id') id: string, @Body() linkFabricDto: LinkFabricDto) {
    return this.productsService.linkFabric(id, linkFabricDto);
  }

  @Post(':id/trims')
  linkTrim(@Param('id') id: string, @Body() linkTrimDto: LinkTrimDto) {
    return this.productsService.linkTrim(id, linkTrimDto);
  }

  @Post(':id/sketches')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/sketches',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadSketch(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.uploadSketch(id, file.path);
  }

  @Delete(':id/fabrics/:fabricId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFabric(@Param('id') id: string, @Param('fabricId') fabricId: string) {
    return this.productsService.removeFabric(id, fabricId);
  }

  @Delete(':id/trims/:trimId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrim(@Param('id') id: string, @Param('trimId') trimId: string) {
    return this.productsService.removeTrim(id, trimId);
  }

  @Get(':id/version-history')
  getVersionHistory(@Param('id') id: string) {
    return this.productsService.getVersionHistory(id);
  }

  @Post('bulk')
  bulkCreate(@Body() bulkUploadDto: BulkUploadDto) {
    return this.productsBulkService.bulkCreate(bulkUploadDto.products);
  }

  @Post('export')
  async exportToExcel(@Body('productIds') productIds: string[]) {
    const products = await Promise.all(
      productIds.map((id) => this.productsService.findOne(id)),
    );
    const buffer = await this.productsBulkService.exportToExcel(products);
    return { buffer: buffer.toString('base64') };
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/bulk',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const fs = require('fs');
    const buffer = fs.readFileSync(file.path);
    return this.productsBulkService.importFromExcel(buffer);
  }
}


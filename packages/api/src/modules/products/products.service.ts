import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { ProductFabric } from '../../database/entities/product-fabric.entity';
import { ProductTrim } from '../../database/entities/product-trim.entity';
import { ProductSketch } from '../../database/entities/product-sketch.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { LinkFabricDto } from './dto/link-fabric.dto';
import { LinkTrimDto } from './dto/link-trim.dto';
import { InventoryService } from '../universe/inventory.service';
import { ProductStatus } from '@virgio/shared';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductFabric)
    private productFabricRepository: Repository<ProductFabric>,
    @InjectRepository(ProductTrim)
    private productTrimRepository: Repository<ProductTrim>,
    @InjectRepository(ProductSketch)
    private productSketchRepository: Repository<ProductSketch>,
    private inventoryService: InventoryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      status: ProductStatus.DRAFT,
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['fabrics', 'trims', 'sketches'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['fabrics', 'trims', 'sketches', 'techPacks', 'sizeSpecs', 'comments'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async linkFabric(productId: string, linkFabricDto: LinkFabricDto): Promise<ProductFabric> {
    const product = await this.findOne(productId);
    
    // Check if fabric exists and has inventory
    const fabricStatus = await this.inventoryService.getInventoryStatus(
      'fabric',
      linkFabricDto.fabricCode,
    );
    
    if (!fabricStatus || fabricStatus.currentQty <= 0) {
      throw new NotFoundException(`Fabric ${linkFabricDto.fabricCode} not available`);
    }

    const productFabric = this.productFabricRepository.create({
      productId: product.id,
      ...linkFabricDto,
    });

    const saved = await this.productFabricRepository.save(productFabric);

    // Deduct inventory if product is not in draft
    if (product.status !== ProductStatus.DRAFT && linkFabricDto.estimatedConsumption) {
      await this.inventoryService.deductInventory(
        'fabric',
        linkFabricDto.fabricCode,
        linkFabricDto.estimatedConsumption,
      );
    }

    return saved;
  }

  async linkTrim(productId: string, linkTrimDto: LinkTrimDto): Promise<ProductTrim> {
    const product = await this.findOne(productId);
    
    // Check if trim exists and has inventory
    const trimStatus = await this.inventoryService.getInventoryStatus(
      'trim',
      linkTrimDto.trimCode,
    );
    
    if (!trimStatus || trimStatus.currentQty <= 0) {
      throw new NotFoundException(`Trim ${linkTrimDto.trimCode} not available`);
    }

    const productTrim = this.productTrimRepository.create({
      productId: product.id,
      ...linkTrimDto,
    });

    const saved = await this.productTrimRepository.save(productTrim);

    // Deduct inventory if product is not in draft
    if (product.status !== ProductStatus.DRAFT && linkTrimDto.estimatedConsumption) {
      await this.inventoryService.deductInventory(
        'trim',
        linkTrimDto.trimCode,
        linkTrimDto.estimatedConsumption,
      );
    }

    return saved;
  }

  async uploadSketch(
    productId: string,
    sketchFilePath: string,
  ): Promise<ProductSketch> {
    const product = await this.findOne(productId);
    
    // Get latest version
    const latestSketch = await this.productSketchRepository.findOne({
      where: { productId: product.id },
      order: { version: 'DESC' },
    });

    const version = latestSketch ? latestSketch.version + 1 : 1;

    const sketch = this.productSketchRepository.create({
      productId: product.id,
      sketchFilePath,
      version,
    });

    return this.productSketchRepository.save(sketch);
  }

  async removeFabric(productId: string, fabricId: string): Promise<void> {
    const productFabric = await this.productFabricRepository.findOne({
      where: { id: fabricId, productId },
    });
    if (!productFabric) {
      throw new NotFoundException('Product fabric link not found');
    }
    await this.productFabricRepository.remove(productFabric);
  }

  async removeTrim(productId: string, trimId: string): Promise<void> {
    const productTrim = await this.productTrimRepository.findOne({
      where: { id: trimId, productId },
    });
    if (!productTrim) {
      throw new NotFoundException('Product trim link not found');
    }
    await this.productTrimRepository.remove(productTrim);
  }

  async getVersionHistory(productId: string): Promise<any[]> {
    const sketches = await this.productSketchRepository.find({
      where: { productId },
      order: { version: 'DESC' },
    });

    return sketches.map((sketch) => ({
      id: sketch.id,
      version: sketch.version,
      sketchFilePath: sketch.sketchFilePath,
      patternId: sketch.patternId,
      createdAt: sketch.createdAt,
    }));
  }
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechPack } from '../../database/entities/tech-pack.entity';
import { SizeSpec } from '../../database/entities/size-spec.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateTechPackDto } from './dto/create-tech-pack.dto';
import { CreateSizeSpecDto } from './dto/create-size-spec.dto';
import { TechPackPdfService } from './tech-pack-pdf.service';
import { TechPackStatus } from '@virgio/shared';

@Injectable()
export class TechPacksService {
  constructor(
    @InjectRepository(TechPack)
    private techPackRepository: Repository<TechPack>,
    @InjectRepository(SizeSpec)
    private sizeSpecRepository: Repository<SizeSpec>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private techPackPdfService: TechPackPdfService,
  ) {}

  async create(productId: string, createTechPackDto: CreateTechPackDto): Promise<TechPack> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['fabrics', 'trims'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    // Check if tech pack already exists
    const existing = await this.techPackRepository.findOne({
      where: { productId, techSpecId: createTechPackDto.techSpecId },
      order: { version: 'DESC' },
    });

    const version = existing ? existing.version + 1 : 1;

    const techPack = this.techPackRepository.create({
      productId,
      techSpecId: createTechPackDto.techSpecId,
      version,
      status: TechPackStatus.DRAFT,
    });

    return this.techPackRepository.save(techPack);
  }

  async findByProduct(productId: string): Promise<TechPack[]> {
    return this.techPackRepository.find({
      where: { productId },
      order: { version: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TechPack> {
    const techPack = await this.techPackRepository.findOne({
      where: { id },
      relations: ['product', 'product.fabrics', 'product.trims', 'product.sketches'],
    });

    if (!techPack) {
      throw new NotFoundException(`Tech pack with id ${id} not found`);
    }

    return techPack;
  }

  async getPendingReviews(techSpecId: string): Promise<TechPack[]> {
    return this.techPackRepository.find({
      where: {
        techSpecId,
        status: TechPackStatus.PENDING_REVIEW,
      },
      relations: ['product'],
      order: { createdAt: 'ASC' },
    });
  }

  async addSizeSpec(productId: string, createSizeSpecDto: CreateSizeSpecDto): Promise<SizeSpec> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const sizeSpec = this.sizeSpecRepository.create({
      productId,
      ...createSizeSpecDto,
    });

    return this.sizeSpecRepository.save(sizeSpec);
  }

  async getSizeSpecs(productId: string): Promise<SizeSpec[]> {
    return this.sizeSpecRepository.find({
      where: { productId },
      order: { size: 'ASC' },
    });
  }

  async generatePdf(id: string): Promise<{ pdfPath: string }> {
    const techPack = await this.findOne(id);
    const sizeSpecs = await this.getSizeSpecs(techPack.productId);

    const pdfPath = await this.techPackPdfService.generateTechPack(
      techPack,
      techPack.product,
      sizeSpecs,
    );

    techPack.pdfPath = pdfPath;
    await this.techPackRepository.save(techPack);

    return { pdfPath };
  }

  async submitForReview(id: string): Promise<TechPack> {
    const techPack = await this.findOne(id);
    techPack.status = TechPackStatus.PENDING_REVIEW;
    return this.techPackRepository.save(techPack);
  }

  async approveForPattern(id: string): Promise<TechPack> {
    const techPack = await this.findOne(id);
    techPack.status = TechPackStatus.APPROVED;
    
    // Update product status
    const product = await this.productRepository.findOne({
      where: { id: techPack.productId },
    });
    if (product) {
      product.status = 'tech_review' as any; // Update to appropriate status
      await this.productRepository.save(product);
    }

    return this.techPackRepository.save(techPack);
  }

  async rejectWithFeedback(id: string, feedback: string): Promise<TechPack> {
    const techPack = await this.findOne(id);
    techPack.status = TechPackStatus.REJECTED;
    
    // TODO: Create comment with feedback
    
    return this.techPackRepository.save(techPack);
  }
}


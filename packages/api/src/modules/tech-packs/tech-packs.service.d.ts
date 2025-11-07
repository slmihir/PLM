import { Repository } from 'typeorm';
import { TechPack } from '../../database/entities/tech-pack.entity';
import { SizeSpec } from '../../database/entities/size-spec.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateTechPackDto } from './dto/create-tech-pack.dto';
import { CreateSizeSpecDto } from './dto/create-size-spec.dto';
import { TechPackPdfService } from './tech-pack-pdf.service';
export declare class TechPacksService {
    private techPackRepository;
    private sizeSpecRepository;
    private productRepository;
    private techPackPdfService;
    constructor(techPackRepository: Repository<TechPack>, sizeSpecRepository: Repository<SizeSpec>, productRepository: Repository<Product>, techPackPdfService: TechPackPdfService);
    create(productId: string, createTechPackDto: CreateTechPackDto): Promise<TechPack>;
    findByProduct(productId: string): Promise<TechPack[]>;
    findOne(id: string): Promise<TechPack>;
    getPendingReviews(techSpecId: string): Promise<TechPack[]>;
    addSizeSpec(productId: string, createSizeSpecDto: CreateSizeSpecDto): Promise<SizeSpec>;
    getSizeSpecs(productId: string): Promise<SizeSpec[]>;
    generatePdf(id: string): Promise<{
        pdfPath: string;
    }>;
    submitForReview(id: string): Promise<TechPack>;
    approveForPattern(id: string): Promise<TechPack>;
    rejectWithFeedback(id: string, feedback: string): Promise<TechPack>;
}
//# sourceMappingURL=tech-packs.service.d.ts.map
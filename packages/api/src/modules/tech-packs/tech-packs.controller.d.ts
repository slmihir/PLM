import { TechPacksService } from './tech-packs.service';
import { CreateTechPackDto } from './dto/create-tech-pack.dto';
import { CreateSizeSpecDto } from './dto/create-size-spec.dto';
export declare class TechPacksController {
    private readonly techPacksService;
    constructor(techPacksService: TechPacksService);
    create(productId: string, createTechPackDto: CreateTechPackDto): Promise<import("../../database/entities/tech-pack.entity").TechPack>;
    findByProduct(productId: string): Promise<import("../../database/entities/tech-pack.entity").TechPack[]>;
    getPendingReviews(techSpecId: string): Promise<import("../../database/entities/tech-pack.entity").TechPack[]>;
    findOne(id: string): Promise<import("../../database/entities/tech-pack.entity").TechPack>;
    generatePdf(id: string): Promise<{
        pdfPath: string;
    }>;
    submitForReview(id: string): Promise<import("../../database/entities/tech-pack.entity").TechPack>;
    approveForPattern(id: string): Promise<import("../../database/entities/tech-pack.entity").TechPack>;
    rejectWithFeedback(id: string, feedback: string): Promise<import("../../database/entities/tech-pack.entity").TechPack>;
    addSizeSpec(productId: string, createSizeSpecDto: CreateSizeSpecDto): Promise<import("../../database/entities/size-spec.entity").SizeSpec>;
    getSizeSpecs(productId: string): Promise<import("../../database/entities/size-spec.entity").SizeSpec[]>;
}
//# sourceMappingURL=tech-packs.controller.d.ts.map
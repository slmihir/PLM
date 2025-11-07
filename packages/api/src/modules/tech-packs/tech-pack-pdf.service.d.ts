import { TechPack } from '../../database/entities/tech-pack.entity';
import { Product } from '../../database/entities/product.entity';
import { SizeSpec } from '../../database/entities/size-spec.entity';
export declare class TechPackPdfService {
    private readonly uploadsDir;
    constructor();
    generateTechPack(techPack: TechPack, product: Product, sizeSpecs: SizeSpec[]): Promise<string>;
}
//# sourceMappingURL=tech-pack-pdf.service.d.ts.map
import { TechPackStatus } from '@virgio/shared';
import { Product } from './product.entity';
export declare class TechPack {
    id: string;
    productId: string;
    product: Product;
    techSpecId: string;
    pdfPath?: string;
    version: number;
    status: TechPackStatus;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=tech-pack.entity.d.ts.map
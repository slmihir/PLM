import { FabricType } from '@virgio/shared';
export declare class CreateFabricDto {
    fabricCode: string;
    gsm?: number;
    weight?: number;
    composition: string;
    washCare: string;
    cost: number;
    fabricType: FabricType;
    leadTime: number;
    supplierInfo?: string;
    inventoryQty: number;
    lowStockThreshold: number;
}
//# sourceMappingURL=create-fabric.dto.d.ts.map
import { ProductsService } from './products.service';
import { ProductsBulkService } from './products-bulk.service';
import { CreateProductDto } from './dto/create-product.dto';
import { LinkFabricDto } from './dto/link-fabric.dto';
import { LinkTrimDto } from './dto/link-trim.dto';
import { BulkUploadDto } from './dto/bulk-upload.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly productsBulkService;
    constructor(productsService: ProductsService, productsBulkService: ProductsBulkService);
    create(createProductDto: CreateProductDto): Promise<import("../../database/entities/product.entity").Product>;
    findAll(): Promise<import("../../database/entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../../database/entities/product.entity").Product>;
    update(id: string, updateData: any): Promise<import("../../database/entities/product.entity").Product>;
    linkFabric(id: string, linkFabricDto: LinkFabricDto): Promise<import("../../database/entities/product-fabric.entity").ProductFabric>;
    linkTrim(id: string, linkTrimDto: LinkTrimDto): Promise<import("../../database/entities/product-trim.entity").ProductTrim>;
    uploadSketch(id: string, file: Express.Multer.File): Promise<import("../../database/entities/product-sketch.entity").ProductSketch>;
    removeFabric(id: string, fabricId: string): Promise<void>;
    removeTrim(id: string, trimId: string): Promise<void>;
    getVersionHistory(id: string): Promise<any[]>;
    bulkCreate(bulkUploadDto: BulkUploadDto): Promise<any[]>;
    exportToExcel(productIds: string[]): Promise<{
        buffer: string;
    }>;
    importFromExcel(file: Express.Multer.File): Promise<any[]>;
}
//# sourceMappingURL=products.controller.d.ts.map
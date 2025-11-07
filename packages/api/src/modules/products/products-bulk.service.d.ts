import { ProductsService } from './products.service';
export declare class ProductsBulkService {
    private readonly productsService;
    constructor(productsService: ProductsService);
    bulkCreate(products: any[]): Promise<any[]>;
    exportToExcel(products: any[]): Promise<Buffer>;
    importFromExcel(fileBuffer: Buffer): Promise<any[]>;
}
//# sourceMappingURL=products-bulk.service.d.ts.map
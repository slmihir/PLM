import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { ProductFabric } from '../../database/entities/product-fabric.entity';
import { ProductTrim } from '../../database/entities/product-trim.entity';
import { ProductSketch } from '../../database/entities/product-sketch.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { LinkFabricDto } from './dto/link-fabric.dto';
import { LinkTrimDto } from './dto/link-trim.dto';
import { InventoryService } from '../universe/inventory.service';
export declare class ProductsService {
    private productRepository;
    private productFabricRepository;
    private productTrimRepository;
    private productSketchRepository;
    private inventoryService;
    constructor(productRepository: Repository<Product>, productFabricRepository: Repository<ProductFabric>, productTrimRepository: Repository<ProductTrim>, productSketchRepository: Repository<ProductSketch>, inventoryService: InventoryService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateData: Partial<Product>): Promise<Product>;
    linkFabric(productId: string, linkFabricDto: LinkFabricDto): Promise<ProductFabric>;
    linkTrim(productId: string, linkTrimDto: LinkTrimDto): Promise<ProductTrim>;
    uploadSketch(productId: string, sketchFilePath: string): Promise<ProductSketch>;
    removeFabric(productId: string, fabricId: string): Promise<void>;
    removeTrim(productId: string, trimId: string): Promise<void>;
    getVersionHistory(productId: string): Promise<any[]>;
}
//# sourceMappingURL=products.service.d.ts.map
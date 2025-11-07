import { Repository } from 'typeorm';
import { Fabric } from '../../database/entities/fabric.entity';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { InventoryService } from './inventory.service';
export declare class FabricsService {
    private fabricRepository;
    private inventoryService;
    constructor(fabricRepository: Repository<Fabric>, inventoryService: InventoryService);
    create(createFabricDto: CreateFabricDto): Promise<Fabric>;
    findAll(): Promise<Fabric[]>;
    findOne(fabricCode: string): Promise<Fabric>;
    update(fabricCode: string, updateFabricDto: UpdateFabricDto): Promise<Fabric>;
    remove(fabricCode: string): Promise<void>;
    updateInventory(fabricCode: string, quantity: number): Promise<Fabric>;
}
//# sourceMappingURL=fabrics.service.d.ts.map
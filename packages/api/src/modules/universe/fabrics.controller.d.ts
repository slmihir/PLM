import { FabricsService } from './fabrics.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
export declare class FabricsController {
    private readonly fabricsService;
    constructor(fabricsService: FabricsService);
    create(createFabricDto: CreateFabricDto): Promise<import("../../database/entities/fabric.entity").Fabric>;
    findAll(): Promise<import("../../database/entities/fabric.entity").Fabric[]>;
    findOne(fabricCode: string): Promise<import("../../database/entities/fabric.entity").Fabric>;
    update(fabricCode: string, updateFabricDto: UpdateFabricDto): Promise<import("../../database/entities/fabric.entity").Fabric>;
    remove(fabricCode: string): Promise<void>;
    updateInventory(fabricCode: string, quantity: number): Promise<import("../../database/entities/fabric.entity").Fabric>;
}
//# sourceMappingURL=fabrics.controller.d.ts.map
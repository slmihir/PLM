import { Repository } from 'typeorm';
import { Trim } from '../../database/entities/trim.entity';
import { CreateTrimDto } from './dto/create-trim.dto';
import { UpdateTrimDto } from './dto/update-trim.dto';
import { InventoryService } from './inventory.service';
export declare class TrimsService {
    private trimRepository;
    private inventoryService;
    constructor(trimRepository: Repository<Trim>, inventoryService: InventoryService);
    create(createTrimDto: CreateTrimDto): Promise<Trim>;
    findAll(): Promise<Trim[]>;
    findOne(trimCode: string): Promise<Trim>;
    update(trimCode: string, updateTrimDto: UpdateTrimDto): Promise<Trim>;
    remove(trimCode: string): Promise<void>;
    updateInventory(trimCode: string, quantity: number): Promise<Trim>;
}
//# sourceMappingURL=trims.service.d.ts.map
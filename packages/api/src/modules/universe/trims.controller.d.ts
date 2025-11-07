import { TrimsService } from './trims.service';
import { CreateTrimDto } from './dto/create-trim.dto';
import { UpdateTrimDto } from './dto/update-trim.dto';
export declare class TrimsController {
    private readonly trimsService;
    constructor(trimsService: TrimsService);
    create(createTrimDto: CreateTrimDto): Promise<import("../../database/entities/trim.entity").Trim>;
    findAll(): Promise<import("../../database/entities/trim.entity").Trim[]>;
    findOne(trimCode: string): Promise<import("../../database/entities/trim.entity").Trim>;
    update(trimCode: string, updateTrimDto: UpdateTrimDto): Promise<import("../../database/entities/trim.entity").Trim>;
    remove(trimCode: string): Promise<void>;
    updateInventory(trimCode: string, quantity: number): Promise<import("../../database/entities/trim.entity").Trim>;
}
//# sourceMappingURL=trims.controller.d.ts.map
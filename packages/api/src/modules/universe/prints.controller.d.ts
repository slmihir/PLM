import { PrintsService } from './prints.service';
import { CreatePrintDto } from './dto/create-print.dto';
export declare class PrintsController {
    private readonly printsService;
    constructor(printsService: PrintsService);
    create(createPrintDto: CreatePrintDto): Promise<import("../../database/entities/print.entity").Print>;
    findAll(): Promise<import("../../database/entities/print.entity").Print[]>;
    findOne(printId: string): Promise<import("../../database/entities/print.entity").Print>;
    updateVersion(printId: string, artworkFilePath: string): Promise<import("../../database/entities/print.entity").Print>;
    updateAvailability(printId: string, availabilityStatus: 'available' | 'unavailable'): Promise<import("../../database/entities/print.entity").Print>;
    remove(printId: string): Promise<void>;
}
//# sourceMappingURL=prints.controller.d.ts.map
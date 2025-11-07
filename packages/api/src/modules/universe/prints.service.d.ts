import { Repository } from 'typeorm';
import { Print } from '../../database/entities/print.entity';
import { CreatePrintDto } from './dto/create-print.dto';
export declare class PrintsService {
    private printRepository;
    constructor(printRepository: Repository<Print>);
    create(createPrintDto: CreatePrintDto): Promise<Print>;
    findAll(): Promise<Print[]>;
    findOne(printId: string): Promise<Print>;
    updateVersion(printId: string, artworkFilePath: string): Promise<Print>;
    updateAvailability(printId: string, availabilityStatus: 'available' | 'unavailable'): Promise<Print>;
    remove(printId: string): Promise<void>;
}
//# sourceMappingURL=prints.service.d.ts.map
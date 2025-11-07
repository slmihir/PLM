import { Repository } from 'typeorm';
import { Color } from '../../database/entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
export declare class ColorsService {
    private colorRepository;
    constructor(colorRepository: Repository<Color>);
    create(createColorDto: CreateColorDto): Promise<Color>;
    findAll(): Promise<Color[]>;
    findBySeason(season: 'SS' | 'AW'): Promise<Color[]>;
    findOne(colorCode: string): Promise<Color>;
    update(colorCode: string, updateData: Partial<CreateColorDto>): Promise<Color>;
    remove(colorCode: string): Promise<void>;
}
//# sourceMappingURL=colors.service.d.ts.map
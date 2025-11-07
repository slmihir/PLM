import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
export declare class ColorsController {
    private readonly colorsService;
    constructor(colorsService: ColorsService);
    create(createColorDto: CreateColorDto): Promise<import("../../database/entities/color.entity").Color>;
    findAll(season?: 'SS' | 'AW'): Promise<import("../../database/entities/color.entity").Color[]>;
    findOne(colorCode: string): Promise<import("../../database/entities/color.entity").Color>;
    update(colorCode: string, updateData: Partial<CreateColorDto>): Promise<import("../../database/entities/color.entity").Color>;
    remove(colorCode: string): Promise<void>;
}
//# sourceMappingURL=colors.controller.d.ts.map
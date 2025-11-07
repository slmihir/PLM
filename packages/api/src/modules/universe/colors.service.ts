import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from '../../database/entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const color = this.colorRepository.create(createColorDto);
    return this.colorRepository.save(color);
  }

  async findAll(): Promise<Color[]> {
    return this.colorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findBySeason(season: 'SS' | 'AW'): Promise<Color[]> {
    return this.colorRepository.find({
      where: { season },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(colorCode: string): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { colorCode },
    });
    if (!color) {
      throw new NotFoundException(`Color with code ${colorCode} not found`);
    }
    return color;
  }

  async update(
    colorCode: string,
    updateData: Partial<CreateColorDto>,
  ): Promise<Color> {
    const color = await this.findOne(colorCode);
    Object.assign(color, updateData);
    return this.colorRepository.save(color);
  }

  async remove(colorCode: string): Promise<void> {
    const color = await this.findOne(colorCode);
    await this.colorRepository.remove(color);
  }
}


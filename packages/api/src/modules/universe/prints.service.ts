import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Print } from '../../database/entities/print.entity';
import { CreatePrintDto } from './dto/create-print.dto';

@Injectable()
export class PrintsService {
  constructor(
    @InjectRepository(Print)
    private printRepository: Repository<Print>,
  ) {}

  async create(createPrintDto: CreatePrintDto): Promise<Print> {
    const print = this.printRepository.create({
      ...createPrintDto,
      version: 1,
    });
    return this.printRepository.save(print);
  }

  async findAll(): Promise<Print[]> {
    return this.printRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(printId: string): Promise<Print> {
    const print = await this.printRepository.findOne({
      where: { printId },
    });
    if (!print) {
      throw new NotFoundException(`Print with id ${printId} not found`);
    }
    return print;
  }

  async updateVersion(printId: string, artworkFilePath: string): Promise<Print> {
    const print = await this.findOne(printId);
    print.version += 1;
    print.artworkFilePath = artworkFilePath;
    return this.printRepository.save(print);
  }

  async updateAvailability(
    printId: string,
    availabilityStatus: 'available' | 'unavailable',
  ): Promise<Print> {
    const print = await this.findOne(printId);
    print.availabilityStatus = availabilityStatus;
    return this.printRepository.save(print);
  }

  async remove(printId: string): Promise<void> {
    const print = await this.findOne(printId);
    await this.printRepository.remove(print);
  }
}


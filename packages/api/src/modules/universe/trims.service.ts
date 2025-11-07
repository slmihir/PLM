import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trim } from '../../database/entities/trim.entity';
import { CreateTrimDto } from './dto/create-trim.dto';
import { UpdateTrimDto } from './dto/update-trim.dto';
import { InventoryService } from './inventory.service';

@Injectable()
export class TrimsService {
  constructor(
    @InjectRepository(Trim)
    private trimRepository: Repository<Trim>,
    private inventoryService: InventoryService,
  ) {}

  async create(createTrimDto: CreateTrimDto): Promise<Trim> {
    const trim = this.trimRepository.create(createTrimDto);
    const saved = await this.trimRepository.save(trim);
    
    // Check low stock after creation
    await this.inventoryService.checkLowStock('trim', saved.trimCode);
    
    return saved;
  }

  async findAll(): Promise<Trim[]> {
    return this.trimRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(trimCode: string): Promise<Trim> {
    const trim = await this.trimRepository.findOne({
      where: { trimCode },
    });
    if (!trim) {
      throw new NotFoundException(`Trim with code ${trimCode} not found`);
    }
    return trim;
  }

  async update(trimCode: string, updateTrimDto: UpdateTrimDto): Promise<Trim> {
    const trim = await this.findOne(trimCode);
    Object.assign(trim, updateTrimDto);
    const updated = await this.trimRepository.save(trim);
    
    // Check low stock after update
    await this.inventoryService.checkLowStock('trim', updated.trimCode);
    
    return updated;
  }

  async remove(trimCode: string): Promise<void> {
    const trim = await this.findOne(trimCode);
    await this.trimRepository.remove(trim);
  }

  async updateInventory(trimCode: string, quantity: number): Promise<Trim> {
    const trim = await this.findOne(trimCode);
    trim.inventoryQty = Math.max(0, trim.inventoryQty + quantity);
    const updated = await this.trimRepository.save(trim);
    
    // Check low stock after inventory update
    await this.inventoryService.checkLowStock('trim', updated.trimCode);
    
    return updated;
  }
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fabric } from '../../database/entities/fabric.entity';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { InventoryService } from './inventory.service';

@Injectable()
export class FabricsService {
  constructor(
    @InjectRepository(Fabric)
    private fabricRepository: Repository<Fabric>,
    private inventoryService: InventoryService,
  ) {}

  async create(createFabricDto: CreateFabricDto): Promise<Fabric> {
    const fabric = this.fabricRepository.create(createFabricDto);
    const saved = await this.fabricRepository.save(fabric);
    
    // Check low stock after creation
    await this.inventoryService.checkLowStock('fabric', saved.fabricCode);
    
    return saved;
  }

  async findAll(): Promise<Fabric[]> {
    return this.fabricRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(fabricCode: string): Promise<Fabric> {
    const fabric = await this.fabricRepository.findOne({
      where: { fabricCode },
    });
    if (!fabric) {
      throw new NotFoundException(`Fabric with code ${fabricCode} not found`);
    }
    return fabric;
  }

  async update(fabricCode: string, updateFabricDto: UpdateFabricDto): Promise<Fabric> {
    const fabric = await this.findOne(fabricCode);
    Object.assign(fabric, updateFabricDto);
    const updated = await this.fabricRepository.save(fabric);
    
    // Check low stock after update
    await this.inventoryService.checkLowStock('fabric', updated.fabricCode);
    
    return updated;
  }

  async remove(fabricCode: string): Promise<void> {
    const fabric = await this.findOne(fabricCode);
    await this.fabricRepository.remove(fabric);
  }

  async updateInventory(fabricCode: string, quantity: number): Promise<Fabric> {
    const fabric = await this.findOne(fabricCode);
    fabric.inventoryQty = Math.max(0, fabric.inventoryQty + quantity);
    const updated = await this.fabricRepository.save(fabric);
    
    // Check low stock after inventory update
    await this.inventoryService.checkLowStock('fabric', updated.fabricCode);
    
    return updated;
  }
}


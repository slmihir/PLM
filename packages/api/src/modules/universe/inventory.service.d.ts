import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Fabric } from '../../database/entities/fabric.entity';
import { Trim } from '../../database/entities/trim.entity';
export declare class InventoryService implements OnModuleInit, OnModuleDestroy {
    private fabricRepository;
    private trimRepository;
    private redisClient;
    constructor(fabricRepository: Repository<Fabric>, trimRepository: Repository<Trim>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    checkLowStock(type: 'fabric' | 'trim', code: string): Promise<void>;
    getLowStockAlerts(): Promise<any[]>;
    deductInventory(type: 'fabric' | 'trim', code: string, quantity: number): Promise<void>;
    getInventoryStatus(type: 'fabric' | 'trim', code: string): Promise<any>;
}
//# sourceMappingURL=inventory.service.d.ts.map
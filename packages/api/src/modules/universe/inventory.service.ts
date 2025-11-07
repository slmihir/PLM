import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fabric } from '../../database/entities/fabric.entity';
import { Trim } from '../../database/entities/trim.entity';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class InventoryService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClientType;

  constructor(
    @InjectRepository(Fabric)
    private fabricRepository: Repository<Fabric>,
    @InjectRepository(Trim)
    private trimRepository: Repository<Trim>,
  ) {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async checkLowStock(type: 'fabric' | 'trim', code: string): Promise<void> {
    let item: Fabric | Trim | null = null;

    if (type === 'fabric') {
      item = await this.fabricRepository.findOne({ where: { fabricCode: code } });
    } else {
      item = await this.trimRepository.findOne({ where: { trimCode: code } });
    }

    if (!item) return;

    const isLowStock = item.inventoryQty <= item.lowStockThreshold;
    const alertKey = `low_stock:${type}:${code}`;

    if (isLowStock) {
      // Set alert in Redis with TTL
      await this.redisClient.setEx(
        alertKey,
        86400, // 24 hours
        JSON.stringify({
          type,
          code,
          currentQty: item.inventoryQty,
          threshold: item.lowStockThreshold,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      // Remove alert if stock is replenished
      await this.redisClient.del(alertKey);
    }
  }

  async getLowStockAlerts(): Promise<any[]> {
    const keys = await this.redisClient.keys('low_stock:*');
    if (keys.length === 0) return [];

    const alerts = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
      }),
    );

    return alerts.filter((alert) => alert !== null);
  }

  async deductInventory(
    type: 'fabric' | 'trim',
    code: string,
    quantity: number,
  ): Promise<void> {
    if (type === 'fabric') {
      const fabric = await this.fabricRepository.findOne({
        where: { fabricCode: code },
      });
      if (fabric) {
        fabric.inventoryQty = Math.max(0, fabric.inventoryQty - quantity);
        await this.fabricRepository.save(fabric);
        await this.checkLowStock('fabric', code);
      }
    } else {
      const trim = await this.trimRepository.findOne({
        where: { trimCode: code },
      });
      if (trim) {
        trim.inventoryQty = Math.max(0, trim.inventoryQty - quantity);
        await this.trimRepository.save(trim);
        await this.checkLowStock('trim', code);
      }
    }
  }

  async getInventoryStatus(type: 'fabric' | 'trim', code: string): Promise<any> {
    let item: Fabric | Trim | null = null;

    if (type === 'fabric') {
      item = await this.fabricRepository.findOne({ where: { fabricCode: code } });
    } else {
      item = await this.trimRepository.findOne({ where: { trimCode: code } });
    }

    if (!item) return null;

    const cacheKey = `inventory:${type}:${code}`;
    const cached = await this.redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const status = {
      code: type === 'fabric' ? (item as Fabric).fabricCode : (item as Trim).trimCode,
      currentQty: item.inventoryQty,
      threshold: item.lowStockThreshold,
      isLowStock: item.inventoryQty <= item.lowStockThreshold,
      lastUpdated: item.updatedAt,
    };

    // Cache for 5 minutes
    await this.redisClient.setEx(cacheKey, 300, JSON.stringify(status));

    return status;
  }
}


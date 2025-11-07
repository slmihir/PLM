import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('api/universe/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('low-stock-alerts')
  getLowStockAlerts() {
    return this.inventoryService.getLowStockAlerts();
  }
}


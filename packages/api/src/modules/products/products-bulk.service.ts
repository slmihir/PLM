import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ProductsBulkService {
  constructor(private readonly productsService: ProductsService) {}

  async bulkCreate(products: any[]): Promise<any[]> {
    const results = [];
    for (const product of products) {
      try {
        const created = await this.productsService.create(product);
        results.push({ success: true, data: created });
      } catch (error: any) {
        results.push({ success: false, error: error?.message || String(error) });
      }
    }
    return results;
  }

  async exportToExcel(products: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'Group ID', key: 'groupId', width: 20 },
      { header: 'Style ID', key: 'styleId', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Designer ID', key: 'designerId', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    products.forEach((product) => {
      worksheet.addRow({
        groupId: product.groupId,
        styleId: product.styleId || '',
        status: product.status,
        designerId: product.designerId,
        createdAt: product.createdAt,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async importFromExcel(fileBuffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    // ExcelJS.load accepts Buffer, Uint8Array, ArrayBuffer, or string
    // Ensure we have a proper Buffer instance
    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
    // Use type assertion to satisfy ExcelJS types
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.getWorksheet(1);
    const products = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const product = {
        groupId: row.getCell(1).value?.toString() || '',
        styleId: row.getCell(2).value?.toString(),
        designerId: row.getCell(4).value?.toString() || '',
      };

      if (product.groupId && product.designerId) {
        products.push(product);
      }
    });

    return this.bulkCreate(products);
  }
}


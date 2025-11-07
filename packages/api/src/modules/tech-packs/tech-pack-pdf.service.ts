import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { TechPack } from '../../database/entities/tech-pack.entity';
import { Product } from '../../database/entities/product.entity';
import { SizeSpec } from '../../database/entities/size-spec.entity';

@Injectable()
export class TechPackPdfService {
  private readonly uploadsDir = './uploads/tech-packs';

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async generateTechPack(
    techPack: TechPack,
    product: Product,
    sizeSpecs: SizeSpec[],
  ): Promise<string> {
    const filename = `tech-pack-${product.groupId}-v${techPack.version}.pdf`;
    const filepath = path.join(this.uploadsDir, filename);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('TECH PACK', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Group ID: ${product.groupId}`, { align: 'center' });
      if (product.styleId) {
        doc.text(`Style ID: ${product.styleId}`, { align: 'center' });
      }
      doc.moveDown();

      // Product Information
      doc.fontSize(16).text('PRODUCT INFORMATION', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Status: ${product.status}`);
      doc.text(`Created: ${product.createdAt.toLocaleDateString()}`);
      doc.moveDown();

      // Fabrics
      if (product.fabrics && product.fabrics.length > 0) {
        doc.fontSize(16).text('FABRICS', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        product.fabrics.forEach((pf, index) => {
          doc.text(`${index + 1}. ${pf.fabricCode} ${pf.isPrimary ? '(Primary)' : ''}`);
          if (pf.estimatedConsumption) {
            doc.text(`   Estimated Consumption: ${pf.estimatedConsumption}`);
          }
        });
        doc.moveDown();
      }

      // Trims
      if (product.trims && product.trims.length > 0) {
        doc.fontSize(16).text('TRIMS', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        product.trims.forEach((pt, index) => {
          doc.text(`${index + 1}. ${pt.trimCode} ${pt.isPrimary ? '(Primary)' : ''}`);
          if (pt.estimatedConsumption) {
            doc.text(`   Estimated Consumption: ${pt.estimatedConsumption}`);
          }
        });
        doc.moveDown();
      }

      // Size Specifications
      if (sizeSpecs.length > 0) {
        doc.fontSize(16).text('SIZE SPECIFICATIONS', { underline: true });
        doc.moveDown();
        doc.fontSize(12);

        sizeSpecs.forEach((spec) => {
          doc.text(`Size: ${spec.size}`);
          Object.entries(spec.measurements).forEach(([key, value]) => {
            doc.text(`  ${key}: ${value}`);
          });
          doc.moveDown();
        });
      }

      // Footer
      doc.fontSize(10).text(
        `Generated on ${new Date().toLocaleString()} | Version ${techPack.version}`,
        { align: 'center' },
      );

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  }
}


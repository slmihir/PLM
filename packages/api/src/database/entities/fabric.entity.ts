import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FabricType } from '@virgio/shared';

@Entity('universe_fabrics')
export class Fabric {
  @PrimaryColumn()
  fabricCode: string;

  @Column({ type: 'int', nullable: true })
  gsm?: number;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'text' })
  composition: string;

  @Column({ type: 'text' })
  washCare: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({
    type: 'enum',
    enum: FabricType,
  })
  fabricType: FabricType;

  @Column({ type: 'int', default: 0 })
  leadTime: number; // days

  @Column({ type: 'text', nullable: true })
  supplierInfo?: string;

  @Column({ type: 'int', default: 0 })
  inventoryQty: number;

  @Column({ type: 'int', default: 10 })
  lowStockThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


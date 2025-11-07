import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('universe_trims')
export class Trim {
  @PrimaryColumn()
  trimCode: string;

  @Column({ type: 'text' })
  material: string;

  @Column({ type: 'text' })
  nomenclature: string;

  @Column({ type: 'text', nullable: true })
  sizeSpecs?: string;

  @Column({ type: 'text', nullable: true })
  finish?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'text', nullable: true })
  treatmentRequirements?: string;

  @Column({ type: 'int', default: 0 })
  leadTime: number; // days

  @Column({ type: 'text', nullable: true })
  supplierInfo?: string;

  @Column({ type: 'int', default: 0 })
  inventoryQty: number;

  @Column({ type: 'int', nullable: true })
  shelfLife?: number; // days

  @Column({ type: 'int', default: 10 })
  lowStockThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


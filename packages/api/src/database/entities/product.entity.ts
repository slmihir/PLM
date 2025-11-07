import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductStatus } from '@virgio/shared';
import { ProductFabric } from './product-fabric.entity';
import { ProductTrim } from './product-trim.entity';
import { ProductSketch } from './product-sketch.entity';
import { TechPack } from './tech-pack.entity';
import { SizeSpec } from './size-spec.entity';
import { Comment } from './comment.entity';
import { WorkflowStage } from './workflow-stage.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column({ nullable: true })
  styleId?: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Column()
  designerId: string;

  @OneToMany(() => ProductFabric, (pf) => pf.product)
  fabrics: ProductFabric[];

  @OneToMany(() => ProductTrim, (pt) => pt.product)
  trims: ProductTrim[];

  @OneToMany(() => ProductSketch, (ps) => ps.product)
  sketches: ProductSketch[];

  @OneToMany(() => TechPack, (tp) => tp.product)
  techPacks: TechPack[];

  @OneToMany(() => SizeSpec, (ss) => ss.product)
  sizeSpecs: SizeSpec[];

  @OneToMany(() => Comment, (c) => c.product)
  comments: Comment[];

  @OneToMany(() => WorkflowStage, (ws) => ws.product)
  workflowStages: WorkflowStage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


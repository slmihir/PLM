import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';
import { Product } from './product.entity';

@Entity('workflow_stages')
export class WorkflowStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.workflowStages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({
    type: 'enum',
    enum: WorkflowStageEnum,
  })
  stage: WorkflowStageEnum;

  @Column({
    type: 'enum',
    enum: StageStatus,
    default: StageStatus.PENDING,
  })
  status: StageStatus;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  delayReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


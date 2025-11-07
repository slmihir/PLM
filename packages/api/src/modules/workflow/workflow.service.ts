import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStage } from '../../database/entities/workflow-stage.entity';
import { Product } from '../../database/entities/product.entity';
import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowStage)
    private workflowStageRepository: Repository<WorkflowStage>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createStage(
    productId: string,
    stage: WorkflowStageEnum,
    assignedTo?: string,
  ): Promise<WorkflowStage> {
    const existing = await this.workflowStageRepository.findOne({
      where: { productId, stage },
    });

    if (existing) {
      return existing;
    }

    const workflowStage = this.workflowStageRepository.create({
      productId,
      stage,
      status: StageStatus.PENDING,
      assignedTo,
    });

    return this.workflowStageRepository.save(workflowStage);
  }

  async transitionStage(
    productId: string,
    stage: WorkflowStageEnum,
    status: StageStatus,
    assignedTo?: string,
    delayReason?: string,
  ): Promise<WorkflowStage> {
    let workflowStage = await this.workflowStageRepository.findOne({
      where: { productId, stage },
    });

    if (!workflowStage) {
      workflowStage = await this.createStage(productId, stage, assignedTo);
    }

    workflowStage.status = status;
    if (assignedTo) {
      workflowStage.assignedTo = assignedTo;
    }
    if (delayReason) {
      workflowStage.delayReason = delayReason;
    }

    if (status === StageStatus.IN_PROGRESS && !workflowStage.startedAt) {
      workflowStage.startedAt = new Date();
    }

    if (status === StageStatus.COMPLETED) {
      workflowStage.completedAt = new Date();
    }

    return this.workflowStageRepository.save(workflowStage);
  }

  async getProductStages(productId: string): Promise<WorkflowStage[]> {
    return this.workflowStageRepository.find({
      where: { productId },
      order: { createdAt: 'ASC' },
    });
  }

  async detectBottlenecks(): Promise<any[]> {
    const bottlenecks = await this.workflowStageRepository
      .createQueryBuilder('ws')
      .where('ws.status = :status', { status: StageStatus.IN_PROGRESS })
      .andWhere('ws.startedAt < :threshold', {
        threshold: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      })
      .getMany();

    return bottlenecks.map((b) => ({
      productId: b.productId,
      stage: b.stage,
      daysInProgress: Math.floor(
        (Date.now() - b.startedAt!.getTime()) / (24 * 60 * 60 * 1000),
      ),
      assignedTo: b.assignedTo,
      delayReason: b.delayReason,
    }));
  }

  async getDelayedProducts(): Promise<any[]> {
    const delayed = await this.workflowStageRepository
      .createQueryBuilder('ws')
      .where('ws.status = :status', { status: StageStatus.BLOCKED })
      .orWhere('ws.delayReason IS NOT NULL')
      .getMany();

    return delayed.map((d) => ({
      productId: d.productId,
      stage: d.stage,
      delayReason: d.delayReason,
      assignedTo: d.assignedTo,
    }));
  }

  async trackProductStatus(productId: string): Promise<any> {
    const stages = await this.getProductStages(productId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    const currentStage = stages.find((s) => s.status === StageStatus.IN_PROGRESS);
    const completedStages = stages.filter((s) => s.status === StageStatus.COMPLETED);
    const blockedStages = stages.filter((s) => s.status === StageStatus.BLOCKED);

    return {
      productId,
      productStatus: product?.status,
      currentStage: currentStage?.stage,
      completedStages: completedStages.map((s) => s.stage),
      blockedStages: blockedStages.map((s) => ({
        stage: s.stage,
        reason: s.delayReason,
      })),
      progress: (completedStages.length / stages.length) * 100,
    };
  }
}


import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';

@Controller('api/workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post(':productId/stages')
  createStage(
    @Param('productId') productId: string,
    @Body('stage') stage: WorkflowStageEnum,
    @Body('assignedTo') assignedTo?: string,
  ) {
    return this.workflowService.createStage(productId, stage, assignedTo);
  }

  @Patch(':productId/stages/:stage')
  transitionStage(
    @Param('productId') productId: string,
    @Param('stage') stage: WorkflowStageEnum,
    @Body('status') status: StageStatus,
    @Body('assignedTo') assignedTo?: string,
    @Body('delayReason') delayReason?: string,
  ) {
    return this.workflowService.transitionStage(
      productId,
      stage,
      status,
      assignedTo,
      delayReason,
    );
  }

  @Get(':productId/stages')
  getProductStages(@Param('productId') productId: string) {
    return this.workflowService.getProductStages(productId);
  }

  @Get(':productId/status')
  trackProductStatus(@Param('productId') productId: string) {
    return this.workflowService.trackProductStatus(productId);
  }

  @Get('bottlenecks')
  detectBottlenecks() {
    return this.workflowService.detectBottlenecks();
  }

  @Get('delayed')
  getDelayedProducts() {
    return this.workflowService.getDelayedProducts();
  }
}


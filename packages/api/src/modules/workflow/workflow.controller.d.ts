import { WorkflowService } from './workflow.service';
import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    createStage(productId: string, stage: WorkflowStageEnum, assignedTo?: string): Promise<import("../../database/entities/workflow-stage.entity").WorkflowStage>;
    transitionStage(productId: string, stage: WorkflowStageEnum, status: StageStatus, assignedTo?: string, delayReason?: string): Promise<import("../../database/entities/workflow-stage.entity").WorkflowStage>;
    getProductStages(productId: string): Promise<import("../../database/entities/workflow-stage.entity").WorkflowStage[]>;
    trackProductStatus(productId: string): Promise<any>;
    detectBottlenecks(): Promise<any[]>;
    getDelayedProducts(): Promise<any[]>;
}
//# sourceMappingURL=workflow.controller.d.ts.map
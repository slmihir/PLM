import { Repository } from 'typeorm';
import { WorkflowStage } from '../../database/entities/workflow-stage.entity';
import { Product } from '../../database/entities/product.entity';
import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';
export declare class WorkflowService {
    private workflowStageRepository;
    private productRepository;
    constructor(workflowStageRepository: Repository<WorkflowStage>, productRepository: Repository<Product>);
    createStage(productId: string, stage: WorkflowStageEnum, assignedTo?: string): Promise<WorkflowStage>;
    transitionStage(productId: string, stage: WorkflowStageEnum, status: StageStatus, assignedTo?: string, delayReason?: string): Promise<WorkflowStage>;
    getProductStages(productId: string): Promise<WorkflowStage[]>;
    detectBottlenecks(): Promise<any[]>;
    getDelayedProducts(): Promise<any[]>;
    trackProductStatus(productId: string): Promise<any>;
}
//# sourceMappingURL=workflow.service.d.ts.map
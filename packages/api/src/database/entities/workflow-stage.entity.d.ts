import { WorkflowStage as WorkflowStageEnum, StageStatus } from '@virgio/shared';
import { Product } from './product.entity';
export declare class WorkflowStage {
    id: string;
    productId: string;
    product: Product;
    stage: WorkflowStageEnum;
    status: StageStatus;
    assignedTo?: string;
    startedAt?: Date;
    completedAt?: Date;
    delayReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=workflow-stage.entity.d.ts.map
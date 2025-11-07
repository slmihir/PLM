import { ProductStatus } from '@virgio/shared';
import { ProductFabric } from './product-fabric.entity';
import { ProductTrim } from './product-trim.entity';
import { ProductSketch } from './product-sketch.entity';
import { TechPack } from './tech-pack.entity';
import { SizeSpec } from './size-spec.entity';
import { Comment } from './comment.entity';
import { WorkflowStage } from './workflow-stage.entity';
export declare class Product {
    id: string;
    groupId: string;
    styleId?: string;
    status: ProductStatus;
    designerId: string;
    fabrics: ProductFabric[];
    trims: ProductTrim[];
    sketches: ProductSketch[];
    techPacks: TechPack[];
    sizeSpecs: SizeSpec[];
    comments: Comment[];
    workflowStages: WorkflowStage[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=product.entity.d.ts.map
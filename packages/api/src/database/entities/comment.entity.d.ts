import { Product } from './product.entity';
export declare class Comment {
    id: string;
    productId: string;
    product: Product;
    userId: string;
    commentText: string;
    attachments?: string[];
    parentCommentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=comment.entity.d.ts.map
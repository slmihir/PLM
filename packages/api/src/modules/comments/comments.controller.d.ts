import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(productId: string, userId: string, createCommentDto: CreateCommentDto): Promise<import("../../database/entities/comment.entity").Comment>;
    findByProduct(productId: string): Promise<import("../../database/entities/comment.entity").Comment[]>;
    getThread(commentId: string): Promise<import("../../database/entities/comment.entity").Comment[]>;
    addAttachment(commentId: string, files: Express.Multer.File[]): Promise<import("../../database/entities/comment.entity").Comment[]>;
}
//# sourceMappingURL=comments.controller.d.ts.map
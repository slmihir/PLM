import { Repository } from 'typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private commentRepository;
    private productRepository;
    constructor(commentRepository: Repository<Comment>, productRepository: Repository<Product>);
    create(productId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Comment>;
    findByProduct(productId: string): Promise<Comment[]>;
    getThread(commentId: string): Promise<Comment[]>;
    addAttachment(commentId: string, attachmentPath: string): Promise<Comment>;
    findByUser(userId: string): Promise<Comment[]>;
}
//# sourceMappingURL=comments.service.d.ts.map
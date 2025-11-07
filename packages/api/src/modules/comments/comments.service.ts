import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    productId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const comment = this.commentRepository.create({
      productId,
      userId,
      ...createCommentDto,
    });

    return this.commentRepository.save(comment);
  }

  async findByProduct(productId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { productId },
      relations: [],
      order: { createdAt: 'ASC' },
    });
  }

  async getThread(commentId: string): Promise<Comment[]> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    // Get all comments in the thread (parent and replies)
    const threadId = comment.parentCommentId || comment.id;
    return this.commentRepository.find({
      where: [
        { id: threadId },
        { parentCommentId: threadId },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async addAttachment(commentId: string, attachmentPath: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    const attachments = comment.attachments || [];
    attachments.push(attachmentPath);
    comment.attachments = attachments;

    return this.commentRepository.save(comment);
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}


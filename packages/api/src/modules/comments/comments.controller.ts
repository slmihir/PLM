import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/products/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(productId, userId, createCommentDto);
  }

  @Get()
  findByProduct(@Param('productId') productId: string) {
    return this.commentsService.findByProduct(productId);
  }

  @Get('thread/:commentId')
  getThread(@Param('commentId') commentId: string) {
    return this.commentsService.getThread(commentId);
  }

  @Post(':commentId/attachments')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/comments',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  addAttachment(
    @Param('commentId') commentId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const attachmentPaths = files.map((file) => file.path);
    return Promise.all(
      attachmentPaths.map((path) =>
        this.commentsService.addAttachment(commentId, path),
      ),
    );
  }
}


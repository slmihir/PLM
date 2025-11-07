import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  commentText: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}


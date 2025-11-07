import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  styleId?: string;

  @IsString()
  designerId: string;
}


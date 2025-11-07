import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { FabricType } from '@virgio/shared';

export class CreateFabricDto {
  @IsString()
  fabricCode: string;

  @IsOptional()
  @IsNumber()
  gsm?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsString()
  composition: string;

  @IsString()
  washCare: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsEnum(FabricType)
  fabricType: FabricType;

  @IsNumber()
  @Min(0)
  leadTime: number;

  @IsOptional()
  @IsString()
  supplierInfo?: string;

  @IsNumber()
  @Min(0)
  inventoryQty: number;

  @IsNumber()
  @Min(0)
  lowStockThreshold: number;
}


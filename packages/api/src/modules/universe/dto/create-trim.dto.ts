import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTrimDto {
  @IsString()
  trimCode: string;

  @IsString()
  material: string;

  @IsString()
  nomenclature: string;

  @IsOptional()
  @IsString()
  sizeSpecs?: string;

  @IsOptional()
  @IsString()
  finish?: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsOptional()
  @IsString()
  treatmentRequirements?: string;

  @IsNumber()
  @Min(0)
  leadTime: number;

  @IsOptional()
  @IsString()
  supplierInfo?: string;

  @IsNumber()
  @Min(0)
  inventoryQty: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shelfLife?: number;

  @IsNumber()
  @Min(0)
  lowStockThreshold: number;
}


import { IsString, IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class LinkFabricDto {
  @IsString()
  fabricCode: string;

  @IsBoolean()
  isPrimary: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedConsumption?: number;
}


import { IsString, IsObject } from 'class-validator';

export class CreateSizeSpecDto {
  @IsString()
  size: string;

  @IsObject()
  measurements: Record<string, number>;
}


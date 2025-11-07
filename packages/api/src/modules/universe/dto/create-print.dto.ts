import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePrintDto {
  @IsString()
  artworkFilePath: string;

  @IsOptional()
  @IsEnum(['available', 'unavailable'])
  availabilityStatus?: 'available' | 'unavailable';
}


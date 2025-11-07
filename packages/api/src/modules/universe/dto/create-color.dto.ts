import { IsString, IsEnum, IsOptional, Matches } from 'class-validator';

export class CreateColorDto {
  @IsString()
  colorCode: string;

  @IsString()
  colorName: string;

  @IsOptional()
  @IsEnum(['SS', 'AW'])
  season?: 'SS' | 'AW';

  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'hexValue must be a valid hex color code',
  })
  hexValue?: string;
}


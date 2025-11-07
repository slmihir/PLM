import { IsString } from 'class-validator';

export class CreateTechPackDto {
  @IsString()
  techSpecId: string;
}


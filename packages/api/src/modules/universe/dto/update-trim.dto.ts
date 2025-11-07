import { PartialType } from '@nestjs/mapped-types';
import { CreateTrimDto } from './create-trim.dto';

export class UpdateTrimDto extends PartialType(CreateTrimDto) {}


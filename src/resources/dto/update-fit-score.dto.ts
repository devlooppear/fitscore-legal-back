import { PartialType } from '@nestjs/mapped-types';
import { CreateFitScoreDto } from './create-fit-score.dto';

export class UpdateFitScoreDto extends PartialType(CreateFitScoreDto) {}

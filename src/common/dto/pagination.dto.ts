import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class PaginationMetaDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  size: number;

  @IsInt()
  @Min(0)
  totalItems: number;

  @IsInt()
  @Min(0)
  totalPages: number;

  @IsBoolean()
  hasNextPage: boolean;

  @IsBoolean()
  hasPreviousPage: boolean;
}

export class PaginationDto<T> {
  @Type(() => Object)
  data: T[];

  @Type(() => PaginationMetaDto)
  metadata: PaginationMetaDto;
}

import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  limit: number = 4;

  @Type(() => Number)
  offset: number = 0;
}
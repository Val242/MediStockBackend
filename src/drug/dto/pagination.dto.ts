import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  limit: number = 3;

  @Type(() => Number)
  offset: number = 0;
}
import { IsOptional, IsPositive, IsString, Max } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

class BasePagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit?: number
}

export class OffsetPaginationDto extends BasePagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  page?: number
}

export class KeysetPaginationDto extends BasePagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastId?: string
}

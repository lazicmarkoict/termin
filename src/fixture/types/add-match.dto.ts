import { IsBoolean, IsMongoId, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class AddMatchDto {
  @ApiProperty()
  @IsMongoId()
  homeId: string

  @ApiProperty()
  @Min(0)
  @Max(100)
  homeScored: number

  @ApiProperty()
  @IsMongoId()
  awayId: string

  @ApiProperty()
  @Min(0)
  @Max(100)
  awayScored: number

  @ApiProperty()
  @IsBoolean()
  isOvertime: boolean
}

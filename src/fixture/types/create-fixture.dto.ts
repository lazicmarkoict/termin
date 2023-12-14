import {
  ArrayNotEmpty,
  ArrayUnique,
  IsPositive,
  IsString,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateFixtureDto {
  @ApiProperty()
  @IsPositive()
  numberOfTeams: number

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  goalkeeperIds: string[]

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  outfieldIds: string[]
}

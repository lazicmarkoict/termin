import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

import { BadRequestException } from '@nestjs/common/exceptions'
import { ApiProperty } from '@nestjs/swagger'

import { PlayerRole } from '~/player'

export class MarkDto {
  @ApiProperty({ enum: PlayerRole })
  @IsEnum(PlayerRole)
  role: PlayerRole

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(10)
  value: number
}

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: MarkDto, isArray: true })
  @ValidateIf((o: CreatePlayerDto) => {
    let role: PlayerRole

    o.marks.forEach(item => {
      if (item.role === role)
        throw new BadRequestException(`One role may only have one mark.`)

      role = item.role
    })

    return true
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Type(() => MarkDto)
  @ValidateNested({ each: true })
  marks: MarkDto[]
}

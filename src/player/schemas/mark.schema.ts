import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { PlayerRole } from '~/player'

@Schema()
export class Mark {
  @ApiProperty()
  @Prop()
  isActive: boolean

  @ApiProperty()
  @Prop()
  value: number

  @ApiProperty({ enum: PlayerRole })
  @Prop()
  role: PlayerRole
}

export const MarkSchema = SchemaFactory.createForClass(Mark)

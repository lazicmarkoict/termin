import { Type } from 'class-transformer'
import mongoose from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Player } from '~/player/schemas/player.schema'

export type SquadDocument = mongoose.HydratedDocument<Squad>

@Schema()
export class Squad extends mongoose.Document {
  @ApiProperty({ type: Player })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    autopopulate: true,
  })
  @Type(() => Player)
  goalkeeper: Player

  @ApiProperty({ type: Player, isArray: true })
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        autopopulate: true,
      },
    ],
  })
  @Type(() => Player)
  outfield: Player[]

  @ApiProperty()
  @Prop()
  rating: number
}

export const SquadSchema = SchemaFactory.createForClass(Squad)

SquadSchema.plugin(require('mongoose-autopopulate'))

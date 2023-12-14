import { Type } from 'class-transformer'
import * as mongoose from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Fixture } from '~/fixture/schemas/fixture.schema'
import { Mark, MarkSchema } from '~/player/schemas/mark.schema'
import { Rating, RatingSchema } from '~/player/schemas/rating.schema'

export type PlayerDocument = mongoose.HydratedDocument<Player>

@Schema({
  timestamps: true,
})
export class Player extends mongoose.Document {
  @ApiProperty({ type: Fixture, isArray: true })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fixture' }] })
  @Type(() => Fixture)
  fixtures: Fixture[]

  @ApiProperty({ type: Mark, isArray: true })
  @Prop({ type: [MarkSchema] })
  @Type(() => Mark)
  marks: Mark[]

  @ApiProperty()
  @Prop()
  name: string

  @ApiProperty({ type: Rating, isArray: true })
  @Prop({ type: [RatingSchema] })
  @Type(() => Rating)
  ratings: Rating[]
}

export const PlayerSchema = SchemaFactory.createForClass(Player)

PlayerSchema.plugin(require('mongoose-autopopulate'))

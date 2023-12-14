import { Type } from 'class-transformer'
import * as mongoose from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { FixtureStatusEnum } from '~/fixture'
import { Match, MatchSchema } from '~/fixture/schemas/match.schema'
import { Squad, SquadSchema } from '~/squad/schemas/squad.schema'

export type FixtureDocument = mongoose.HydratedDocument<Fixture>

@Schema({
  timestamps: true,
})
export class Fixture {
  @ApiProperty({ type: Match, isArray: true })
  @Prop({ type: [MatchSchema], autopopulate: true })
  @Type(() => Match)
  matches: Match[]

  @ApiProperty({ type: Squad, isArray: true })
  @Prop({ type: [SquadSchema], autopopulate: true })
  @Type(() => Squad)
  teams: Squad[]

  @ApiProperty({ enum: FixtureStatusEnum })
  @Prop({ default: FixtureStatusEnum.CREATED })
  status: FixtureStatusEnum
}

export const FixtureSchema = SchemaFactory.createForClass(Fixture)

FixtureSchema.plugin(require('mongoose-autopopulate'))

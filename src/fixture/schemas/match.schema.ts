import { Type } from 'class-transformer'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Squad, SquadSchema } from '~/squad/schemas/squad.schema'

@Schema()
class Team {
  @ApiProperty({ type: Squad })
  @Prop({ type: SquadSchema })
  @Type(() => Squad)
  squad: Squad

  @ApiProperty()
  @Prop()
  scored: number
}

const TeamSchema = SchemaFactory.createForClass(Team)

@Schema()
export class Match {
  @ApiProperty({ type: Team })
  @Prop({ type: TeamSchema })
  @Type(() => Team)
  home: Team

  @ApiProperty({ type: Team })
  @Prop({ type: TeamSchema })
  @Type(() => Team)
  away: Team

  @ApiProperty()
  @Prop()
  isOvertime: boolean
}

export const MatchSchema = SchemaFactory.createForClass(Match)

MatchSchema.plugin(require('mongoose-autopopulate'))

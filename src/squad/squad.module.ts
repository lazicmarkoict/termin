import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Squad, SquadSchema } from '~/squad/schemas/squad.schema'

import { SquadService } from './squad.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Squad.name, schema: SquadSchema }]),
  ],
  exports: [SquadService],
  providers: [SquadService],
})
export class SquadModule {}

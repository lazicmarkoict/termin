import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Fixture, FixtureSchema } from '~/fixture/schemas/fixture.schema'
import { PlayerModule } from '~/player/player.module'
import { SquadModule } from '~/squad/squad.module'

import { FixtureController } from './fixture.controller'
import { FixtureService } from './fixture.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fixture.name, schema: FixtureSchema }]),
    PlayerModule,
    SquadModule,
  ],
  controllers: [FixtureController],
  providers: [FixtureService],
})
export class FixtureModule {}

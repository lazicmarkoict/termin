import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Player, PlayerSchema } from '~/player/schemas/player.schema'

import { PlayerController } from './player.controller'
import { PlayerService } from './player.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}

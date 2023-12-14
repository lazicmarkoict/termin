import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ParamsWithId } from '~/common'
import { CreatePlayerDto } from '~/player'
import { Player } from '~/player/schemas/player.schema'

import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {
  constructor(private readonly service: PlayerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all players.' })
  @ApiResponse({
    status: 200,
    description: 'List of all players.',
    type: Player,
    isArray: true,
  })
  async findAll(): Promise<Player[]> {
    return await this.service.findAll()
  }

  @Post()
  @ApiOperation({ summary: 'Create a player.' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created player.',
    type: Player,
  })
  async create(@Body() player: CreatePlayerDto): Promise<Player> {
    return await this.service.create(player)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single player.' })
  @ApiResponse({
    status: 200,
    description: 'Player in details.',
    type: Player,
  })
  async findOne(@Param() { id }: ParamsWithId): Promise<Player> {
    return await this.service.findOne(id)
  }
}

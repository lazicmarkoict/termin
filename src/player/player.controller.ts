import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Role } from '~/auth/enums'
import { RoleGuard } from '~/auth/guards/role.guard'
import { OffsetPaginationDto, ParamsWithId } from '~/common'
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
  async findAll(@Query() query: OffsetPaginationDto): Promise<Player[]> {
    return await this.service.findAll(query.page, query.limit)
  }

  @UseGuards(RoleGuard(Role.ADMIN))
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

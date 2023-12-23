import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { JwtAuthenticationGuard } from '~/auth/guards/jwt-authentication.guard'
import { ParamsWithId } from '~/common'
import { AddMatchDto, CreateFixtureDto, FixtureStatusEnum } from '~/fixture'
import { Fixture } from '~/fixture/schemas/fixture.schema'

import { FixtureService } from './fixture.service'

@Controller('fixture')
export class FixtureController {
  constructor(private readonly service: FixtureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all fixtures.' })
  @ApiResponse({
    status: 200,
    description: 'List of all fixtures.',
    type: Fixture,
    isArray: true,
  })
  async findAll(): Promise<Fixture[]> {
    return await this.service.findAll()
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Create a fixture.' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created fixture.',
    type: Fixture,
  })
  async create(@Body() fixture: CreateFixtureDto): Promise<Fixture> {
    return await this.service.create(fixture)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single fixture.' })
  @ApiResponse({
    status: 200,
    description: 'Fixture in details.',
    type: Fixture,
  })
  async findOne(@Param() { id }: ParamsWithId): Promise<Fixture> {
    return await this.service.findOne(id)
  }

  @Patch('/:id/end')
  @ApiOperation({
    summary: `Updates fixture status to ${FixtureStatusEnum.ENDED} and processes matches.`,
  })
  @ApiResponse({
    status: 200,
    description: `Successfully ended fixture.`,
    type: Fixture,
  })
  async end(@Param() { id }: ParamsWithId): Promise<Fixture> {
    return await this.service.end(id)
  }

  @Patch('/:id/add-match')
  @ApiOperation({ summary: 'Adds a match to the list.' })
  @ApiResponse({
    status: 200,
    description: `Successfully added another match.`,
    type: Fixture,
  })
  async addMatch(
    @Param() { id }: ParamsWithId,
    @Body() addMatchDto: AddMatchDto,
  ): Promise<Fixture> {
    return await this.service.addMatch(id, addMatchDto)
  }
}

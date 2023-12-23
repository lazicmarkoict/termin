import { Connection, Model } from 'mongoose'

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'

import { AddMatchDto, CreateFixtureDto, FixtureStatusEnum } from '~/fixture'
import { Fixture, FixtureDocument } from '~/fixture/schemas/fixture.schema'
import { Match } from '~/fixture/schemas/match.schema'
import { PlayerRole } from '~/player'
import { PlayerService } from '~/player/player.service'
import { SquadService } from '~/squad/squad.service'
import { UserService } from '~/user/user.service'

@Injectable()
export class FixtureService {
  constructor(
    @InjectModel(Fixture.name) private model: Model<FixtureDocument>,
    private readonly playerService: PlayerService,
    private readonly squadService: SquadService,
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(): Promise<Fixture[]> {
    return await this.model.find().exec()
  }

  async findOne(id: string): Promise<Fixture> {
    return await this.model.findById(id)
  }

  async create(
    createFixtureDto: CreateFixtureDto,
    userId: string,
  ): Promise<Fixture> {
    let result: Fixture
    const { numberOfTeams, goalkeeperIds, outfieldIds } = createFixtureDto
    const session = await this.connection.startSession()

    await session.withTransaction(async () => {
      const players = await this.playerService.model
        .find({
          _id: {
            $in: [...goalkeeperIds, ...outfieldIds],
          },
        })
        .exec()

      if (goalkeeperIds.length !== numberOfTeams)
        throw new BadRequestException(
          'Number of goalkeepers and teams must be equal.',
        )

      if (outfieldIds.length % numberOfTeams !== 0)
        throw new BadRequestException(
          `Number of outfield players must be the same in each team.`,
        )

      const goalkeepers = players.filter(player =>
        goalkeeperIds.includes(player._id.toString()),
      )
      const outfield = players.filter(player =>
        outfieldIds.includes(player._id.toString()),
      )
      const fixture = new this.model()
      const owner = await this.userService.getById(userId)

      fixture.createdBy = owner
      fixture.teams = await this.squadService.createMany(
        this.squadService.drawTeams(goalkeepers, outfield),
      )
      result = await fixture.save()
    })

    session.endSession()

    return result
  }

  async end(fixtureId: string): Promise<Fixture> {
    let result: Fixture
    const session = await this.connection.startSession()

    await session.withTransaction(async () => {
      const fixture = await this.model.findById(fixtureId)

      if (!fixture)
        throw new NotFoundException(
          `Couldn't find a fixture with provided id: ${fixtureId}`,
        )

      if (fixture.status !== FixtureStatusEnum.ONGOING)
        throw new BadRequestException(
          `It is possible only to end an ongoing fixture.`,
        )

      await this.processEndedFixtures(fixture)
      result = await this.updateStatus(fixtureId)
    })

    session.endSession()

    return result
  }

  private async updateStatus(
    id: string,
    statusToSet = FixtureStatusEnum.ENDED,
  ): Promise<Fixture> {
    const fixture = await this.model.findById(id)

    if (!fixture)
      throw new NotFoundException(
        `Couldn't find a fixture with provided id: ${id}`,
      )

    if (
      fixture.status !== FixtureStatusEnum.ONGOING &&
      statusToSet === FixtureStatusEnum.ENDED
    )
      throw new BadRequestException(
        `It's possible to end only an already ongoing fixture.`,
      )

    if (
      fixture.status !== FixtureStatusEnum.CREATED &&
      statusToSet === FixtureStatusEnum.ONGOING
    )
      throw new BadRequestException(
        `It's possible to start only a recently created fixture.`,
      )

    return await this.updateOne(id, { status: statusToSet })
  }

  async addMatch(
    fixtureId: string,
    addMatchDto: AddMatchDto,
  ): Promise<Fixture> {
    let result: Fixture
    const fixture = await this.model.findById(fixtureId)
    const { awayId, awayScored, homeId, homeScored, isOvertime } = addMatchDto

    if (!fixture)
      throw new NotFoundException(
        `Couldn't find a fixture with provided id: ${fixtureId}`,
      )

    this.validate(fixture, addMatchDto)

    const session = await this.connection.startSession()

    await session.withTransaction(async () => {
      if (!fixture.matches.length)
        await this.updateStatus(fixtureId, FixtureStatusEnum.ONGOING)

      const home = await this.squadService.findOne(homeId)
      const away = await this.squadService.findOne(awayId)
      const match: Match = {
        home: { squad: home, scored: homeScored },
        away: { squad: away, scored: awayScored },
        isOvertime: isOvertime,
      }

      result = await this.updateOne(fixtureId, {
        matches: [...fixture.matches, match],
      })
    })
    session.endSession()

    return result
  }

  private async updateOne(
    id: string,
    partial: Partial<Fixture>,
  ): Promise<Fixture> {
    return await this.model.findByIdAndUpdate(id, { ...partial }, { new: true })
  }

  private validate(fixture: Fixture, addMatchDto: AddMatchDto): void {
    const { awayId, awayScored, homeId, homeScored } = addMatchDto
    const activeStatuses = [
      FixtureStatusEnum.CREATED,
      FixtureStatusEnum.ONGOING,
    ]
    const participantsIds: string[] = fixture.teams.map(team =>
      team._id.toString(),
    )
    const isEachTeamParticipating =
      participantsIds.includes(homeId) && participantsIds.includes(awayId)

    if (!activeStatuses.includes(fixture.status))
      throw new BadRequestException(
        `Matches can be added only for ${FixtureStatusEnum.CREATED} and ${FixtureStatusEnum.ONGOING} fixtures.`,
      )

    if (homeId === awayId)
      throw new BadRequestException(
        `In order to add a match, the rivals must be different.`,
      )

    if (!isEachTeamParticipating)
      throw new BadRequestException(
        `Both teams must be present in the current fixture.`,
      )

    if (homeScored === awayScored)
      throw new BadRequestException(`Please enter a result that is not tied.`)
  }

  private async processEndedFixtures(fixture: Fixture): Promise<void> {
    for (const team of fixture.teams) {
      let totalRatingEarned = 0

      const filtered = fixture.matches.filter(
        match =>
          match.home.squad._id.toString() === team._id.toString() ||
          match.away.squad._id.toString() === team._id.toString(),
      )

      filtered.forEach(match => {
        const atHome = team._id.toString() === match.home.squad._id.toString()
        const homeWon = match.home.scored > match.away.scored
        const ratingPerResult = atHome
          ? homeWon
            ? 10
            : -10
          : homeWon
            ? -10
            : 10

        const overtimeRate = match.isOvertime ? 0.75 : 1
        const ratingPerMatch = ratingPerResult * overtimeRate

        totalRatingEarned += ratingPerMatch
      })

      const activeGkRating = team.goalkeeper.ratings.find(
        rating =>
          rating.isActive === true && rating.role === PlayerRole.GOALKEEPER,
      )
      activeGkRating.value += totalRatingEarned

      await this.playerService.update(team.goalkeeper._id.toString(), {
        fixtures: [...team.goalkeeper.fixtures, fixture],
        ratings: [
          ...team.goalkeeper.ratings.filter(
            rating =>
              rating.isActive === false || rating.role === PlayerRole.OUTFIELD,
          ),
          activeGkRating,
        ],
      })

      for (const player of team.outfield) {
        const activeRating = player.ratings.find(
          rating =>
            rating.isActive === true && rating.role === PlayerRole.OUTFIELD,
        )

        activeRating.value += totalRatingEarned

        await this.playerService.update(player._id.toString(), {
          fixtures: [...player.fixtures, fixture],
          ratings: [
            ...player.ratings.filter(
              rating =>
                rating.isActive === false ||
                rating.role === PlayerRole.GOALKEEPER,
            ),
            activeRating,
          ],
        })
      }
    }
  }
}

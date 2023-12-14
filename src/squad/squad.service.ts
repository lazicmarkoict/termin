import { Model } from 'mongoose'

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { PlayerRole } from '~/player'
import { Player } from '~/player/schemas/player.schema'
import { Squad, SquadDocument } from '~/squad/schemas/squad.schema'

@Injectable()
export class SquadService {
  constructor(@InjectModel(Squad.name) readonly model: Model<SquadDocument>) {}

  async findOne(id: string): Promise<Squad> {
    return await this.model.findById(id).exec()
  }

  async createMany(squad: Partial<Squad>[]): Promise<Squad[]> {
    return await this.model.insertMany(
      squad.map(squad => new this.model(squad)),
    )
  }

  drawTeams(goalkeepers: Player[], outfield: Player[]): Partial<Squad>[] {
    const drawn: Partial<Squad>[] = goalkeepers.map(gk => ({
      rating: gk.ratings.find(rating => rating.role === PlayerRole.GOALKEEPER)
        .value,
      goalkeeper: gk,
      outfield: [] as Player[],
    }))

    outfield.sort(
      (a, b) =>
        b.ratings.find(rating => rating.role === PlayerRole.OUTFIELD).value -
        a.ratings.find(rating => rating.role === PlayerRole.OUTFIELD).value,
    )

    for (const player of outfield) {
      const lowestRatedTeam = drawn.sort((a, b) => a.rating - b.rating)[0]

      lowestRatedTeam.outfield.push(player)
      lowestRatedTeam.rating += player.ratings.find(
        rating => rating.role === PlayerRole.OUTFIELD,
      ).value
    }

    return drawn
  }
}

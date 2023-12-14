import { Model } from 'mongoose'

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CreatePlayerDto, MarkDto, PlayerRole } from '~/player'
import { Player, PlayerDocument } from '~/player/schemas/player.schema'

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) readonly model: Model<PlayerDocument>,
  ) {}

  async findAll(): Promise<Player[]> {
    return await this.model.find().exec()
  }

  async findOne(id: string): Promise<Player> {
    return await this.model.findById(id).populate('fixtures').exec()
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.model({
      marks: createPlayerDto.marks.map(mark => ({
        isActive: true,
        role: mark.role,
        value: mark.value,
      })),
      name: createPlayerDto.name,
      ratings: createPlayerDto.marks.map(mark => ({
        isActive: true,
        value: this.calculateInitialRating({
          role: mark.role,
          value: mark.value,
        }),
        role: mark.role,
      })),
    })

    return await createdPlayer.save()
  }

  async update(id: string, partial: Partial<Player>): Promise<Player> {
    return await this.model.findByIdAndUpdate(id, partial, { new: true })
  }

  private calculateInitialRating(mark: MarkDto): number {
    const BASE_GK_RATING = 10000
    const BASE_PLAYER_RATING = 1000

    return mark.role === PlayerRole.OUTFIELD
      ? BASE_PLAYER_RATING + mark.value * 400
      : BASE_GK_RATING + mark.value * 200
  }
}

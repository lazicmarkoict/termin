import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { User, UserDocument } from '~/user/schemas/user.schema'
import { CreateUserDto } from '~/user/types'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {}

  async getByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email })
  }

  async getByEmailAndFail(email: string): Promise<User> {
    const user = await this.model.findOne({ email })

    if (user) return user

    throw new NotFoundException(`User with email: ${email} does not exist.`)
  }

  async getById(id: string): Promise<User> {
    const user = await this.model.findById(id)

    if (user) return user

    throw new NotFoundException(`User with id: ${id} does not exist.`)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.model(createUserDto)

    return await createdUser.save()
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10)

    return await this.model.findByIdAndUpdate(
      userId,
      { currentHashedRefreshToken },
      { new: true },
    )
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.getById(userId)
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    )

    if (isRefreshTokenMatching) return user
  }

  async removeRefreshToken(userId: string): Promise<User> {
    return await this.model.findByIdAndUpdate(
      userId,
      {
        currentHashedRefreshToken: null,
      },
      { new: true },
    )
  }
}

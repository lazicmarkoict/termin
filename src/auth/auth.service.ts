import * as bcrypt from 'bcrypt'

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { RegisterDto, TokenPayload } from '~/auth/dtos'
import { MongoErrorCode } from '~/auth/enums'
import { User } from '~/user/schemas/user.schema'
import { UserService } from '~/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registrationDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registrationDto.password, 10)

    try {
      const createdUser = await this.userService.create({
        ...registrationDto,
        password: hashedPassword,
      })

      return createdUser
    } catch (error) {
      if (error?.code === MongoErrorCode.UniqueViolation)
        throw new BadRequestException(
          `User with email:${registrationDto.email} already exists.`,
        )

      throw new InternalServerErrorException('Something went wrong.')
    }
  }

  async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userService.getByEmail(email)

      await this.verifyPassword(plainTextPassword, user.password)

      return user
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided.')
    }
  }

  getCookieWithJwtAccessToken(userId: string): string {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME_IN_SECONDS')}s`,
    })

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME_IN_SECONDS',
    )}`
  }

  getCookieWithJwtRefreshToken(userId: string): {
    cookie: string
    token: string
  } {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS',
      )}s`,
    })
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS',
    )}`

    return {
      cookie,
      token,
    }
  }

  getCookiesForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    )

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided.')
    }
  }
}

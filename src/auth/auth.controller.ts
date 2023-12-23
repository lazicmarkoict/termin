import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'

import { AuthService } from '~/auth/auth.service'
import { RegisterDto, RequestWithUser } from '~/auth/dtos'
import { JwtAuthenticationGuard } from '~/auth/guards/jwt-authentication.guard'
import { JwtRefreshGuard } from '~/auth/guards/jwt-refresh.guard'
import { LocalAuthenticationGuard } from '~/auth/guards/local-authentication.guard'
import { User } from '~/user/schemas/user.schema'
import { UserService } from '~/user/user.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user._id,
    )

    request.res.setHeader('Set-Cookie', accessTokenCookie)

    return request.user
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({
    type: User,
  })
  async logIn(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<Response<User>> {
    const { user } = request
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user._id,
    )
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.getCookieWithJwtRefreshToken(user._id)

    await this.userService.setCurrentRefreshToken(refreshToken, user._id)
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])

    return response.send(user)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser): Promise<void> {
    await this.userService.removeRefreshToken(request.user._id)

    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut())
  }
}

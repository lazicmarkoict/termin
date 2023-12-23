import { Strategy } from 'passport-local'

import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from '~/auth/auth.service'
import { User } from '~/user/schemas/user.schema'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    return await this.authService.getAuthenticatedUser(email, password)
  }
}

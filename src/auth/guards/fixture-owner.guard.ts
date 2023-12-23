import { ExecutionContext, Injectable } from '@nestjs/common'

import { RequestWithUser } from '~/auth/dtos'
import { Role } from '~/auth/enums'
import { JwtAuthenticationGuard } from '~/auth/guards/jwt-authentication.guard'
import { FixtureService } from '~/fixture/fixture.service'

@Injectable()
export class FixtureOwnerGuard extends JwtAuthenticationGuard {
  constructor(private readonly fixtureService: FixtureService) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const fixture = await this.fixtureService.findOne(request.params.id)
    const user = request.user

    return (
      user._id.toString() === fixture.createdBy._id.toString() ||
      user.roles.includes(Role.ADMIN)
    )
  }
}

import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common'

import { Role } from '~/auth/enums'
import { JwtAuthenticationGuard } from '~/auth/guards/jwt-authentication.guard'
import { RequestWithUser } from '~/auth/types'

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context)

      const request = context.switchToHttp().getRequest<RequestWithUser>()
      const user = request.user

      return user?.roles.includes(role)
    }
  }

  return mixin(RoleGuardMixin)
}

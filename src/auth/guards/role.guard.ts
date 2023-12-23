import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common'

import { RequestWithUser } from '~/auth/dtos'
import { Role } from '~/auth/enums'
import { JwtAuthenticationGuard } from '~/auth/guards/jwt-authentication.guard'

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

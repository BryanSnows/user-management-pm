import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { isArray } from 'class-validator';

export function PermissionGuard(permission: any): Type<CanActivate> {
  class PermissionGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<any>();
      const profile: string = request?.user.profile_name;

      if (isArray(permission)) {
        return permission?.includes(profile);
      }
      return permission === profile;
    }
  }
  return mixin(PermissionGuardMixin);
}

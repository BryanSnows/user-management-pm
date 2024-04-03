import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IGNORE_JWT_GUARD_KEY } from 'src/shared/decorators/ignore-jwt-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ignoreJwtGuard = this.reflector.getAllAndOverride<boolean>(IGNORE_JWT_GUARD_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (ignoreJwtGuard) {
      return true;
    }

    return super.canActivate(context);
  }
}

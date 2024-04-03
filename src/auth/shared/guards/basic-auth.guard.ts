import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IGNORE_BASIC_AUTH_KEY } from 'src/shared/decorators/ignore-basic-auth.decorator';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const IgnoreBasicGuard = this.reflector.getAllAndOverride<boolean>(IGNORE_BASIC_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (IgnoreBasicGuard) {
      return true;
    }

    return super.canActivate(context);
  }
}

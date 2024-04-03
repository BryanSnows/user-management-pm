import { Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtFirstAccessStrategy extends PassportStrategy(Strategy, 'jwt-first-access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_FIRST_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(@Request() request: Request, payload: any): Promise<any> {
    const refresh_token = request.headers['authorization'].replace('Bearer', '').trim();
    return {
      email: payload.email,
      refresh_token: refresh_token,
    };
  }
}

import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './shared/auth.service';
import { LocalStrategy } from './shared/strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './shared/strategies/jwt-refresh.strategy';
import { BasicStrategy } from './shared/strategies/basic.strategy';
import { JwtFirstAccessStrategy } from './shared/strategies/jwt-first-access.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    BasicStrategy,
    JwtFirstAccessStrategy,
  ],
})
export class AuthModule {}

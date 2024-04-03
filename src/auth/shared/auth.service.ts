import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { hash, isMatchHash } from 'src/shared/hash';
import Tokens from '../interfaces/tokens';
import { FirstAccessDto } from '../dto/first-access.dto';
import { Validations } from 'src/shared/validations';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não cadastrado!');
    }
    if (!user.user_password) {
      throw new UnauthorizedException('Usuário ainda com primeiro acesso!');
    }

    const checkPass = await isMatchHash(password, user.user_password);

    if (user && checkPass) {
      return user;
    }

    return null;
  }

  async login(user: LoginDTO) {
    const userSaved = await this.userService.findByEmail(user.email);

    const { access_token, refresh_token } = await this.getTokens(
      userSaved.user_email,
      userSaved.user_name,
      userSaved.profile_id,
      userSaved.profile.profile_name,
    );

    await this.userService.updateRefreshToken(userSaved.user_id, await hash(refresh_token));
    return {
      name: userSaved.user_name,
      email: userSaved.user_email,
      profile: userSaved.profile,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async refreshToken(email: string, refreshToken: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    if (!user.user_refresh_token) {
      throw new HttpException('Refresh token does not exist on this user', HttpStatus.NOT_FOUND);
    }

    const verifyIfMatchHash = await isMatchHash(refreshToken, user.user_refresh_token);

    if (!verifyIfMatchHash) {
      throw new HttpException('Refresh token does not match', HttpStatus.NOT_FOUND);
    }

    const { access_token, refresh_token } = await this.getTokens(
      user.user_email,
      user.user_name,
      user.profile_id,
      user.profile.profile_name,
    );

    const hashed_refresh_token = await hash(refresh_token);

    await this.userService.updateRefreshToken(user.user_id, hashed_refresh_token);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      name: user.user_name,
      profile: user.profile.profile_name,
      expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    };
  }

  async removeRefreshToken(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    const updateLogoutToken = await this.userService.updateRefreshToken(user.user_id, null);

    return {
      message: `Usuário saiu do sistema`,
      updateLogoutToken,
    };
  }

  async firstAccess(email: string, firstAccessDto: FirstAccessDto) {
    const { current_password, new_password, confirmation_password } = firstAccessDto;

    const userSaved = await this.userService.findByEmail(email);

    Validations.getInstance().verifyLength(firstAccessDto.new_password, 'new_password', 6, 12);

    Validations.getInstance().verifyLength(
      firstAccessDto.confirmation_password,
      'confirmation_password',
      6,
      12,
    );

    if (!userSaved) {
      throw new NotFoundException('Usuário não cadastrado!');
    }

    const checkCurrentPassword = await isMatchHash(current_password, userSaved.user_password);

    if (!checkCurrentPassword) {
      throw new UnauthorizedException('Senha de primeiro acesso incorreta!');
    }

    if (new_password === current_password || confirmation_password === current_password) {
      throw new UnauthorizedException('A nova senha não pode coincidir com a anterior!');
    }

    if (new_password !== confirmation_password) {
      throw new UnauthorizedException('A senha e confirmação de senha não coincidem!');
    }

    return this.userService.changePassword({ email, new_password });
  }

  async getTokens(
    email: string,
    name: string,
    profile_id: number,
    profile_name: string,
  ): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: email,
          name: name,
          profile_id: profile_id,
          profile_name: profile_name,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN,
          algorithm: 'HS256',
        },
      ),
      this.jwtService.signAsync(
        {
          email: email,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
          algorithm: 'HS256',
        },
      ),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}

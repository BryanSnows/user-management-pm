import { Controller, Post, Body, Request, UseGuards, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IgnoreJwtGuard } from 'src/shared/decorators/ignore-jwt-auth.decorator';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './shared/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';
import { FirstAccessDto } from './dto/first-access.dto';
import { JwtFirstAccessAuthGuard } from './shared/guards/jwt-first-access.guard';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary:
      'LOG INTO THE SYSTEM BY GENERATING AUTHENTICATION TOKEN OR IN CASE OF FIRST ACCESS, CODE BY EMAIL',
  })
  @Post('/login')
  @IgnoreJwtGuard()
  @UseGuards(LocalAuthGuard)
  async auth(@Body() auth: LoginDTO) {
    return this.authService.login(auth);
  }

  @ApiOperation({ summary: 'ENDPOINT USED FOR LOGOUT, REMOVING REFRESH TOKEN' })
  @ApiBearerAuth()
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() payload: any) {
    return this.authService.removeRefreshToken(payload.user.email);
  }

  @ApiOperation({ summary: 'REFRESH TOKEN ENDPOINT' })
  @Post('/refresh_token')
  @ApiBearerAuth()
  @IgnoreJwtGuard()
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Request() payload: any) {
    return this.authService.refreshToken(payload.user.email, payload.user.refresh_token);
  }

  // @ApiOperation({ summary: 'FIRST ACCESS ENDPOINT' })
  // @Post('/first_access')
  // @ApiBearerAuth()
  // @IgnoreJwtGuard()
  // @UseGuards(JwtFirstAccessAuthGuard)
  // async firstAccess(@Request() payload: any, @Body() firstAccessDto: FirstAccessDto) {
  //   return this.authService.firstAccess(payload.user.email, firstAccessDto);
  // }
}

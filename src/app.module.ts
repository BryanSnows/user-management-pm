import { Module } from '@nestjs/common';
import { SwaggerModule } from './config/swagger/swagger.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { AppDataSource } from './config/database/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), AuthModule, SwaggerModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWTConfigService } from 'src/configs/jwt.config';
import { UsersModule } from 'src/modules/users.module';
import { AuthUtils } from 'src/services/utils/auth.utils';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { RepositoriesModule } from './global/repository.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTConfigService, AuthUtils, JwtService],
  imports: [
    JwtModule.registerAsync({
      useClass: JWTConfigService,
    }),
    RepositoriesModule,
    UsersModule,
  ],
  exports: [AuthService, AuthUtils],
})
export class AuthModule {}

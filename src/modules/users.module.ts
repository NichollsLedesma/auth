import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfigService } from 'src/configs/jwt.config';
import { UsersController } from 'src/controllers/users.controller';
import { UsersService } from 'src/services/users.service';
import { AuthUtils } from 'src/services/utils/auth.utils';
import { RepositoriesModule } from './global/repository.module';

@Module({
  imports: [RepositoriesModule],
  providers: [UsersService, JWTConfigService, AuthUtils, JwtService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { RoleController } from 'src/controllers/role.controller';
import { RoleService } from 'src/services/role.service';
import { UsersService } from 'src/services/users.service';
import { AuthModule } from './auth.module';
import { RepositoriesModule } from './global/repository.module';

@Module({
  imports: [RepositoriesModule, AuthModule],
  controllers: [RoleController],
  providers: [RoleService, UsersService],
  exports: [],
})
export class RoleModule {}

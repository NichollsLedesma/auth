import { Module } from '@nestjs/common';
import { RoleController } from 'src/controllers/role.controller';
import { RoleService } from 'src/services/role.service';
import { RepositoriesModule } from './global/repository.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [],
})
export class RoleModule {}

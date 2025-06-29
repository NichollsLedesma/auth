import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/modules/global/schemas.module';
import { RefreshTokenRepository, UserRepository } from 'src/repositories';
import { RoleRepository } from 'src/repositories/role.repository';

const repositories = [UserRepository, RefreshTokenRepository, RoleRepository];
@Module({
  imports: [SchemasModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}

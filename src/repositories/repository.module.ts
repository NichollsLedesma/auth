import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { RefreshTokenRepository, UserRepository } from './';

const repositories = [UserRepository, RefreshTokenRepository];
@Module({
  imports: [SchemasModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configs/configuration';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { RepositoriesModule } from './repositories/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig, jwtConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || ''),
    RepositoriesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

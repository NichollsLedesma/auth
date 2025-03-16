import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './refreshToken.schema';
import { User, UserSchema } from './user.schema';

export const schemas = [
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  exports: [MongooseModule],
})
export class SchemasModule {}

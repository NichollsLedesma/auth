import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../schemas/refreshToken.schema';
import { User, UserSchema } from '../../schemas/user.schema';

export const schemas = [
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
  { name: Role.name, schema: RoleSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  exports: [MongooseModule],
})
export class SchemasModule {}

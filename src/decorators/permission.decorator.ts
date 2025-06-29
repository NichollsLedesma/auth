import { SetMetadata } from '@nestjs/common';
import { PermissionDto } from 'src/controllers/dtos/role.dto';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (permissions: PermissionDto[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

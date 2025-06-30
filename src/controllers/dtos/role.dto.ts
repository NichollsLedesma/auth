import { Action } from 'src/schemas/enums/action.enum';
import { Resource } from 'src/schemas/enums/resource.enum';

export class PermissionDto {
  resource: Resource;
  actions: Action[];
}
export class RoleDto {
  name: string;
  permissions: PermissionDto[];
}

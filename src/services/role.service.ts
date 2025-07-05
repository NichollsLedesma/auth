import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RoleDto } from 'src/controllers/dtos/role.dto';
import { RoleRepository } from 'src/repositories/role.repository';
import { Role } from 'src/schemas/role.schema';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  private mapRoleToDto(role: Role) {
    return {
      name: role.name,
      permissions: role.permissions.map((permission) => ({
        resource: permission.resource,
        actions: permission.actions,
      })),
    };
  }
  public async getAll() {
    this.logger.log('getting all roles');
    const roles = await this.roleRepository.getAll();
    return roles.map((role: Role) => this.mapRoleToDto(role));
  }

  public async createRole(role: RoleDto) {
    this.logger.log(`creating role: ${JSON.stringify(role)}`);
    const { name } = role;
    const roleExists = await this.roleRepository.findOne({ name });
    if (roleExists)
      throw new BadRequestException(`Role ${name} already exists`);

    const newRole = await this.roleRepository.create(role);
    return this.mapRoleToDto(newRole);
  }
}

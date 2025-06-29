import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDtoCreate, UserDtoResponse } from 'src/controllers/dtos/users.dto';
import { UserRepository } from 'src/repositories';
import { Permission } from 'src/schemas/permission.schema';
import { Role } from 'src/schemas/role.schema';
import { findUserBy } from './types/users.type';
import { GeneratorUtils } from './utils/generator.utils';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  public async create(userDto: UserDtoCreate): Promise<UserDtoResponse> {
    const user = await this.userRepository.create({
      ...userDto,
      publicUserId: GeneratorUtils.getUUID(),
    });

    return {
      id: user.publicUserId,
      email: userDto.email,
      username: userDto.username,
    };
  }

  public async getUserPermissions(publicUserId: string): Promise<any[]> {
    const user = await this.getUserBy({ publicUserId }, ['role']);
    if (!user) throw new NotFoundException('User not found');

    if (!user.role) return [];

    const role = user.role as unknown as Role;

    return role.permissions.map((permission: Permission) => ({
      actions: permission.actions,
      resource: permission.resource,
    }));
  }

  public async getUserBy(filter: findUserBy, populate: string[] = []) {
    return (await this.userRepository.findOne(filter, populate)) || null;
  }

  public async getAll() {
    const users = this.userRepository.findAll();

    return users;
  }
}

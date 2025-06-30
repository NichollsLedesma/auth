import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto } from 'src/controllers/dtos/users.dto';
import { UserRepository } from 'src/repositories';
import { Role } from 'src/schemas/role.schema';
import { User } from 'src/schemas/user.schema';
import { Permission } from './types/auth.type';
import { GeneratorUtils } from './utils/generator.utils';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  private mapUserToResponse(user: User): ResponseUserDto {
    return {
      id: user.publicUserId,
      email: user.email,
      username: user.username,
    };
  }
  public async create(userDto: CreateUserDto): Promise<ResponseUserDto> {
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

  public async getUserPermissions(publicUserId: string): Promise<Permission[]> {
    const user = await this.getUserBy({ publicUserId }, ['role']);
    if (!user) throw new NotFoundException('User not found');

    if (!user.role) return [];

    const role = user.role as unknown as Role;

    return role.permissions.map((permission: Permission) => ({
      actions: permission.actions,
      resource: permission.resource,
    }));
  }

  public async getUserBy(filter: Partial<User>, populate: string[] = []) {
    return (await this.userRepository.findOne(filter, populate)) || null;
  }

  public async getAll() {
    const users = await this.userRepository.findAll();

    return users.map((user) => this.mapUserToResponse(user));
  }
}

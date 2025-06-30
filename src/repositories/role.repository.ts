import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleDto } from 'src/controllers/dtos/role.dto';
import { Role } from 'src/schemas/role.schema';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  public async create(roleDto: RoleDto) {
    const role = await this.roleModel.create(roleDto);
    return role;
  }

  public async getAll() {
    const roles = await this.roleModel.find();
    return roles;
  }

  public async findOne(filter: Partial<Role>) {
    return await this.roleModel.findOne(filter);
  }
}

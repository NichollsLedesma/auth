import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { createRoleSchema } from 'src/middlewares/joiSchemas';
import { RoleService } from 'src/services/role.service';
import { RoleDtoCreate } from './dtos/role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRole(@Body() roleDto: RoleDtoCreate) {
    const { error } = createRoleSchema.validate(roleDto);
    if (error) throw new BadRequestException(error.message);

    return this.roleService.createRole(roleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return this.roleService.getAll();
  }
}

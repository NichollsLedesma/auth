import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/decorators/permission.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { createRoleSchema } from 'src/middlewares/joiSchemas';
import { Action } from 'src/schemas/enums/action.enum';
import { Resource } from 'src/schemas/enums/resource.enum';
import { RoleService } from 'src/services/role.service';
import { RoleDto } from './dtos/role.dto';

@Controller('roles')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions([
    { resource: Resource.roles, actions: [Action.create, Action.read] },
  ])
  public async createRole(@Body() roleDto: RoleDto) {
    const { error } = createRoleSchema.validate(roleDto);
    if (error) throw new BadRequestException(error.message);

    return this.roleService.createRole(roleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions([{ resource: Resource.roles, actions: [Action.read] }])
  public async getAll() {
    return this.roleService.getAll();
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/decorators/permission.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Action } from 'src/schemas/enums/action.enum';
import { Resource } from 'src/schemas/enums/resource.enum';
import { UsersService } from 'src/services/users.service';

@Controller('users')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions([
    { resource: Resource.users, actions: [Action.read] },
    { resource: Resource.roles, actions: [Action.read] },
  ])
  @Get()
  public async fetchAll() {
    // TODO: add filters and paginated
    return await this.usersService.getAll();
  }
}

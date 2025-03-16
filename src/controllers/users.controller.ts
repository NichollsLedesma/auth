import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorization.guard';
import { UsersService } from 'src/services/users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async fetchAll() {
    // TODO: add filters and paginated
    return await this.usersService.getAll();
  }
}

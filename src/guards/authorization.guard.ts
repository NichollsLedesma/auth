/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionDto } from 'src/controllers/dtos/role.dto';
import { PERMISSIONS_KEY } from 'src/decorators/permission.decorator';
import { Action } from 'src/schemas/enums/action.enum';
import { UsersService } from 'src/services/users.service';
import { AuthUtils } from 'src/services/utils/auth.utils';

type RequestWithUser = Request & {
  userId?: string;
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
    private readonly authUtils: AuthUtils,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.userId) throw new UnauthorizedException(`token is required.`);

    const routePermissions: PermissionDto[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if the route no requires permissions, return true
    if (routePermissions.length === 0) return true;

    const userPermissions = await this.userService.getUserPermissions(
      request.userId,
    );

    if (userPermissions.length === 0) throw new ForbiddenException();

    for (const rousePermission of routePermissions) {
      const userPermission: PermissionDto = userPermissions.find(
        (userPermission: PermissionDto) =>
          userPermission.resource === rousePermission.resource,
      );

      if (!userPermission) throw new ForbiddenException();
      const hasPermission = rousePermission.actions.every(
        (requiredAction: Action) =>
          userPermission.actions.includes(requiredAction),
      );

      if (!hasPermission)
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
    }
    return true;
  }
}

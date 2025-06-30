import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/decorators/permission.decorator';
import { Action } from 'src/schemas/enums/action.enum';
import { Permission } from 'src/schemas/permission.schema';
import { UsersService } from 'src/services/users.service';

export type RequestWithUser = Request & {
  userId?: string;
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.userId) throw new UnauthorizedException(`token is required.`);

    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
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
      const userPermission: Permission | undefined = userPermissions.find(
        (userPermission: Permission) =>
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

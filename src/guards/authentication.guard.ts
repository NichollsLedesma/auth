/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUtils } from 'src/services/utils/auth.utils';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authUtils: AuthUtils) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException(`token is required.`);

    try {
      const payload = await this.authUtils.extractDataFromToken(token);
      request['userId'] = payload.id;
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('jwt malformed'))
        throw new BadRequestException('Invalid token');
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader: string = request.headers['authorization'];
    if (!authorizationHeader) return undefined;

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

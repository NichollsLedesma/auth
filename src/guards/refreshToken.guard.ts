/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTConfigService } from 'src/configs/jwt.config';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtConfigService: JWTConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(`token is required`);
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigService.secret,
      });
      throw new BadRequestException(`Token must be expirated`);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('jwt expired')) return true;

      Logger.error(err);
      if (error.message.includes('jwt malformed'))
        throw new BadRequestException('Invalid token');
      else throw err;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader: string = request.headers['authorization'];
    if (!authorizationHeader) return undefined;

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

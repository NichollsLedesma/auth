import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger(JWTConfigService.name);
  createJwtOptions(): JwtModuleOptions {
    const jwtOptions = {
      secret: this.secret,
      signOptions: { expiresIn: this.expiresIn },
    };
    return jwtOptions;
  }
  constructor(private readonly configService: ConfigService) {}

  public get secret(): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) this.logger.warn(`jwt secret is missing`);
    return jwtSecret || '';
  }
  public get expiresIn(): string {
    const milliSeconds = 60 * 60 * 1000; // 1h
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    if (!expiresIn) return milliSeconds.toString();

    return expiresIn;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    const jwtOptions = {
      secret: this.secret,
      signOptions: { expiresIn: this.expiresIn },
    };
    // Logger.log({ jwtOptions });
    return jwtOptions;
  }
  constructor(private readonly configService: ConfigService) {}

  public get secret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }
  public get expiresIn(): string {
    const milliSeconds = 60 * 60 * 1000; // 1h
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    if (!expiresIn) return milliSeconds.toString();

    return expiresIn;
  }
}

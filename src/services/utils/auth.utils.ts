import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWTConfigService } from 'src/configs/jwt.config';
import { payloadToken } from '../types/auth.type';

@Injectable()
export class AuthUtils {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JWTConfigService,
  ) {}

  public get expiresIn(): string {
    return this.jwtConfigService.expiresIn;
  }
  public async compare(password: string, hash: string) {
    try {
      const isMatch = await bcrypt.compare(password, hash);

      return isMatch;
    } catch {
      return false;
    }
  }
  public async encryptPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }
  public async generateToken(payload: payloadToken) {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.secret,
      expiresIn: this.jwtConfigService.expiresIn,
    });

    return token;
  }

  public async extractDataFromToken(token: string) {
    const payload: payloadToken = await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfigService.secret,
    });
    return payload;
  }
}

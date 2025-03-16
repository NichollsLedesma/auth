import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/schemas/refreshToken.schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  public async create(sessionDto: any) {
    const session = await this.refreshTokenModel.create(sessionDto);
    return session;
  }
  public async findOne(filter: Partial<RefreshToken>) {
    return await this.refreshTokenModel.findOne(filter);
  }
}

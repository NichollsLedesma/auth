import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(userDto: any) {
    const user = await this.userModel.create(userDto);
    return user;
  }

  public async findOne(filter: Partial<User>) {
    return await this.userModel.findOne(filter);
  }
  public async findAll(filter = {}) {
    return await this.userModel.find(filter);
  }
}

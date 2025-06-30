import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/controllers/dtos/users.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(userDto: CreateUserDto) {
    const user = await this.userModel.create(userDto);
    return user;
  }

  public async findOne(filter: Partial<User>, populate: string[]) {
    return await this.userModel.findOne(filter).populate(populate);
  }
  public async findAll(filter = {}) {
    return await this.userModel.find(filter);
  }
}

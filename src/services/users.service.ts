import { Injectable } from '@nestjs/common';
import { UserDtoCreate, UserDtoResponse } from 'src/controllers/dtos/users.dto';
import { UserRepository } from 'src/repositories';
import { UserDocument } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { findUserBy } from './types/users.type';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  public async create(userDto: UserDtoCreate): Promise<UserDtoResponse> {
    const publicUserId = uuidv4();
    const user = await this.userRepository.create({ ...userDto, publicUserId });

    return {
      id: user.publicUserId,
      email: userDto.email,
      username: userDto.username,
    };
  }

  public async getUserBy(filter: findUserBy): Promise<UserDocument | null> {
    return (await this.userRepository.findOne(filter)) || null;
  }

  public async getAll() {
    const users = this.userRepository.findAll();

    return users;
  }
}

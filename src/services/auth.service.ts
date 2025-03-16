import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  LoginDtoRequest,
  LoginDtoResponse,
  SingUpDtoRequest,
} from 'src/controllers/dtos/auth.dto';
import { RefreshTokenRepository } from 'src/repositories';
import { UserDocument } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { AuthUtils } from './utils/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authUtils: AuthUtils,
  ) {}
  public async singUp(singUpDto: SingUpDtoRequest) {
    const { email, username, password } = singUpDto;
    const cleanedEmail = email.toLowerCase();
    const cleanedUserName = username.toLowerCase();
    let user = await this.userService.getUserBy({ email: cleanedEmail });
    if (!user)
      user = await this.userService.getUserBy({ username: cleanedUserName });

    if (user) throw new BadRequestException(`Account already exists`);

    const encryptedPassword = await this.authUtils.encryptPassword(password);
    const newUser = await this.userService.create({
      email: cleanedEmail,
      username: cleanedUserName,
      password: encryptedPassword,
    });

    return newUser;
  }

  public async singIn(loginDto: LoginDtoRequest): Promise<LoginDtoResponse> {
    const { email, password } = loginDto;
    const user = await this.userService.getUserBy({ email });
    if (!user) throw new NotFoundException(`user ${email} not found.`);

    if (!(await this.authUtils.compare(password, user.password)))
      throw new UnauthorizedException(`Password does not match`);

    const refreshToken = await this.refreshTokenRepository.findOne({ user });
    if (!refreshToken) return await this.generateSession(user);

    return {
      accessToken: refreshToken.accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }
  private async saveSession(sessionData: {
    accessToken: string;
    refreshToken: string;
    user: UserDocument;
  }) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      user: sessionData.user,
    });
    if (refreshToken) {
      refreshToken.accessToken = sessionData.accessToken;
      refreshToken.refreshToken = sessionData.refreshToken;

      await refreshToken.save();
    } else await this.refreshTokenRepository.create(sessionData);
  }

  public async refreshToken(refreshToken: string) {
    const refreshTokenFounded = await this.refreshTokenRepository.findOne({
      refreshToken,
    });

    if (!refreshTokenFounded)
      throw new NotFoundException(`refresh token not found: ${refreshToken}`);

    await refreshTokenFounded.populate('user');
    return await this.generateSession(refreshTokenFounded.user as UserDocument);
  }

  private async generateSession(user: UserDocument) {
    const payload = {
      id: user.publicUserId,
    };
    const accessToken = await this.authUtils.generateToken(payload);
    const refreshToken = uuidv4();

    await this.saveSession({ accessToken, refreshToken, user });

    return {
      accessToken,
      refreshToken,
    };
  }
}

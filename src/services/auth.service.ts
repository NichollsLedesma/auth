import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  LoginDto,
  ResponseLoginDto,
  SingUpDto,
} from 'src/controllers/dtos/auth.dto';
import { RefreshTokenRepository } from 'src/repositories';
import { UserDocument } from 'src/schemas/user.schema';

import { Role } from 'src/schemas/role.schema';
import { SessionData } from './types/auth.type';
import { UsersService } from './users.service';
import { AuthUtils } from './utils/auth.utils';
import { GeneratorUtils } from './utils/generator.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authUtils: AuthUtils,
  ) {}
  public async singUp(singUpDto: SingUpDto) {
    const { email, username, password } = singUpDto;
    this.logger.log(`sing up user: ${JSON.stringify({ email, username })}`);
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

  public async singIn(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const { email, password } = loginDto;
    this.logger.log(`sing in user: ${JSON.stringify({ email })}`);
    const user = await this.userService.getUserBy({ email });
    if (!user) throw new NotFoundException(`user ${email} not found.`);

    if (!(await this.authUtils.compare(password, user.password)))
      throw new UnauthorizedException(`Password does not match`);

    const refreshToken = await this.refreshTokenRepository.findOne({ user });
    if (!refreshToken) return await this.generateSession(user);

    const now = new Date();
    if (now.getTime() >= refreshToken.expiresIn) {
      this.logger.log(`update expired token to user ${user.publicUserId}`);
      return await this.generateSession(user);
    }

    return {
      accessToken: refreshToken.accessToken,
      refreshToken: refreshToken.refreshToken,
      expiresDate: new Date(refreshToken.expiresIn),
    };
  }
  private async saveSession(sessionData: SessionData) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      user: sessionData.user,
    });
    if (refreshToken) {
      refreshToken.expiresIn = sessionData.expiresIn;
      refreshToken.accessToken = sessionData.accessToken;
      refreshToken.refreshToken = sessionData.refreshToken;

      await refreshToken.save();
    } else await this.refreshTokenRepository.create(sessionData);
  }

  public async refreshToken(refreshToken: string) {
    this.logger.log(`refreshing token`);
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
    const refreshToken = GeneratorUtils.getUUID();
    const now = new Date();
    const expiresIn = now.getTime() + Number(this.authUtils.expiresIn);
    this.logger.log(`saving session for user ${user.publicUserId}`);

    await this.saveSession({ accessToken, refreshToken, expiresIn, user });

    return {
      accessToken,
      refreshToken,
      expiresDate: new Date(expiresIn),
    };
  }

  public async me(publicUserId: string) {
    const user = await this.userService.getUserBy({ publicUserId }, ['role']);
    if (!user) throw new NotFoundException(`user not found.`);

    const userData = {
      id: user.publicUserId,
      email: user.email,
      username: user.username,
    };
    if (!user.role) return userData;

    const role = user.role as unknown as Role;

    return {
      ...userData,
      role: {
        name: role.name,
        permissions: role.permissions.map((permission) => ({
          resource: permission.resource,
          actions: permission.actions,
        })),
      },
    };
  }
}

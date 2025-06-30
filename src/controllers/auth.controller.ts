import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RequestWithUser } from 'src/guards/authorization.guard';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import {
  refreshTokenSchema,
  signInSchema,
  signUpSchema,
} from 'src/middlewares/joiSchemas';
import { AuthService } from 'src/services/auth.service';
import { LoginDto, SingUpDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sing-up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() singUpDto: SingUpDto) {
    const { error } = signUpSchema.validate(singUpDto);
    if (error) throw new BadRequestException(error.message);

    return this.authService.singUp(singUpDto);
  }

  @Post('sing-in')
  async login(@Body() loginDto: LoginDto) {
    const { error } = signInSchema.validate(loginDto);
    if (error) throw new BadRequestException(error.message);

    return this.authService.singIn(loginDto);
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Body() data: { refreshToken: string }) {
    // TODO: validate user <> token
    const { error } = refreshTokenSchema.validate(data);
    if (error) throw new BadRequestException(error.message);

    return this.authService.refreshToken(data.refreshToken);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async me(@Req() req: RequestWithUser) {
    const user = await this.authService.me(req.userId as string);
    return user;
  }
}

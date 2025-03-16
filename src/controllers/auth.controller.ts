import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import {
  refreshTokenSchema,
  signInSchema,
  signUpSchema,
} from 'src/middlewares/joiSchemas';
import { AuthService } from 'src/services/auth.service';
import { LoginDtoRequest, SingUpDtoRequest } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() singUpDto: SingUpDtoRequest) {
    const { error } = signUpSchema.validate(singUpDto);
    if (error) throw new BadRequestException(error.message);

    return this.authService.singUp(singUpDto);
  }

  @Post('singin')
  async login(@Body() loginDto: LoginDtoRequest) {
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
}

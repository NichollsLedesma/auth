import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { AuthService } from 'src/services/auth.service';
import { LoginDtoRequest, SingUpDtoRequest } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() singUpDto: SingUpDtoRequest) {
    return this.authService.singUp(singUpDto);
  }

  @Post('singin')
  async login(@Body() loginDto: LoginDtoRequest) {
    return this.authService.singIn(loginDto);
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Body() data: { refreshToken: string }) {
    return this.authService.refreshToken(data.refreshToken);
  }
}

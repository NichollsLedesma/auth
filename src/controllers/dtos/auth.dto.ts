export class LoginDto {
  email: string;
  password: string;
}

export class ResponseLoginDto {
  accessToken: string;
  refreshToken: string;
  expiresDate: Date;
}

export class SingUpDto {
  username: string;
  email: string;
  password: string;
}

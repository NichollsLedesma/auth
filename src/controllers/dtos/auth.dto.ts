export class LoginDtoRequest {
  email: string;
  password: string;
}

export class LoginDtoResponse {
  accessToken: string;
  refreshToken: string;
}

export class SingUpDtoRequest {
  username: string;
  email: string;
  password: string;
}

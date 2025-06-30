export class CreateUserDto {
  email: string;
  username: string;
  password: string;
  publicUserId?: string;
}

export class ResponseUserDto {
  id: string;
  email: string;
  username: string;
}

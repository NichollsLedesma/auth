export class UserDtoCreate {
  email: string;
  username: string;
  password: string;
  publicUserId?: string;
}

export class UserDtoResponse {
  id: string;
  email: string;
  username: string;
}

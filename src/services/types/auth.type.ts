import { Action } from 'src/schemas/enums/action.enum';
import { Resource } from 'src/schemas/enums/resource.enum';
import { UserDocument } from 'src/schemas/user.schema';

export type PayloadToken = { id: string; iat?: number; exp?: number };
export type SessionData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDocument;
};

export type Permission = { resource: Resource; actions: Action[] };

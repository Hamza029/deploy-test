import { Request } from 'express';
import { IUser } from './user';

export interface IProtectedRequest extends Request {
  user?: IUser;
}

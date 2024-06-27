import { UserRoles } from '../constants';

interface IUserAttributes {
  Id: number;
  Username: string;
  Email: string;
  Name: string;
  JoinDate: Date;
  Role: UserRoles;
  Password: string;
}

export interface IUser extends Omit<IUserAttributes, 'Password'> {}

export interface IUserInput
  extends Omit<IUserAttributes, 'Id' | 'JoinDate' | 'Role'> {}

export interface IUserResponse
  extends Pick<IUserAttributes, 'Username' | 'Name' | 'Email'> {}

export interface IUserDbInput
  extends Omit<IUserAttributes, 'Id' | 'Password'> {}

export interface IUserUpdateInput extends Pick<IUserAttributes, 'Name'> {}

export interface IUserUpdateDbInput extends Pick<IUserAttributes, 'Name'> {}

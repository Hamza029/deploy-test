import {
  IUserInput,
  IUserDbInput,
  IUserResponse,
  IUser,
  IUserUpdateDbInput,
  IUserUpdateInput,
} from '../../interfaces';
import { UserRoles } from '../../constants';

export class UserDbInputDTO implements IUserDbInput {
  Username: string;
  Email: string;
  Name: string;
  JoinDate: Date;
  Role: UserRoles;

  constructor(user: IUserInput) {
    this.Username = user.Username;
    this.Email = user.Email;
    this.Name = user.Name;
    this.JoinDate = new Date();
    this.Role = UserRoles.USER;
  }
}

export class UserResponseDTO implements IUserResponse {
  Username: string;
  Name: string;
  Email: string;

  constructor(user: IUser) {
    this.Username = user.Username;
    this.Name = user.Name;
    this.Email = user.Email;
  }
}

export class UserUpdateDBInputDTO implements IUserUpdateDbInput {
  Name: string;

  constructor(user: IUserUpdateInput) {
    this.Name = user.Name;
  }
}

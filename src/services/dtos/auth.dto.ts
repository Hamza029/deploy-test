import {
  IUserInput,
  IAuthDbInput,
  IAuthInput,
  IAuthLoginResponse,
  IUpdatePasswordDbInput,
  IUpdatePasswordInput,
} from '../../interfaces';

export class AuthDbInputDTO implements IAuthDbInput {
  Username: string;
  Password: string;
  PasswordModifiedAt: Date;

  constructor(user: IUserInput) {
    this.Username = user.Username;
    this.Password = user.Password;
    this.PasswordModifiedAt = new Date();
  }
}

export class AuthInputDTO implements IAuthInput {
  Username: string;
  Password: string;

  constructor(auth: IAuthInput) {
    this.Username = auth.Username;
    this.Password = auth.Password;
  }
}

export class AuthLoginResponseDTO implements IAuthLoginResponse {
  Token: string;

  constructor(Token: string) {
    this.Token = Token;
  }
}

export class UpdatePasswordDbInputDTO implements IUpdatePasswordDbInput {
  Password: string;
  PasswordModifiedAt: Date;

  constructor(updatePasswordInput: IUpdatePasswordInput) {
    this.Password = updatePasswordInput.newPassword;
    this.PasswordModifiedAt = new Date();
  }
}

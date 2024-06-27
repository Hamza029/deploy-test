interface IAuthAttributes {
  Id: number;
  Username: string;
  Name: string;
  Role: number;
  Password: string;
  Token: string;
  PasswordModifiedAt: Date;
}

export interface IAuth
  extends Omit<IAuthAttributes, 'Name' | 'Role' | 'Token'> {}

export interface IAuthInput
  extends Pick<IAuthAttributes, 'Username' | 'Password'> {}

export interface IAuthDbInput
  extends Pick<
    IAuthAttributes,
    'Username' | 'Password' | 'PasswordModifiedAt'
  > {}

export interface IAuthJWTPayload
  extends Pick<IAuthAttributes, 'Username' | 'Name' | 'Role'> {
  iat?: number;
  exp?: number;
}

export interface IAuthLoginResponse extends Pick<IAuthAttributes, 'Token'> {}

export interface IUpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordDbInput
  extends Pick<IAuthAttributes, 'Password' | 'PasswordModifiedAt'> {}

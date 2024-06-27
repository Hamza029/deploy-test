import { Response, NextFunction } from 'express';
import {
  IAuthJWTPayload,
  IUser,
  IProtectedRequest,
  IAuth,
} from '../interfaces';
import userRepository from '../repository/userRepository';
import jwtUtil from '../utils/jwtUtil';
import authRepository from '../repository/authRepository';
import AppError from '../utils/appError';
import { HTTPStatusCode } from '../constants';

const authenticate = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string | undefined = req.header('Authorization');

    const payload: IAuthJWTPayload = await jwtUtil.authenticate(token);

    const auth: IAuth | undefined = await authRepository.getAuthByUsername(
      payload.Username
    );

    if (!auth) {
      return next(new AppError('User does not exist', HTTPStatusCode.NotFound));
    }

    const passwordChangedAt: number = Math.floor(
      Date.parse(auth.PasswordModifiedAt.toISOString()) / 1000
    );

    const jwtIssuedAt: number = payload.iat!;

    // console.log(passwordChangedAt, jwtIssuedAt);

    if (passwordChangedAt > jwtIssuedAt) {
      return next(
        new AppError(
          'Password changed, please login again',
          HTTPStatusCode.Unauthorized
        )
      );
    }

    const currentUser: IUser | undefined =
      await userRepository.getUserByUsername(payload.Username);

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export default {
  authenticate,
};

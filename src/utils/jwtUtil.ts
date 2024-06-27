import jwt from 'jsonwebtoken';

import { IAuthJWTPayload } from '../interfaces';
import { HTTPStatusCode } from './../constants';
import { conf } from '../config/conf';
import AppError from './appError';

const getToken = (payload: IAuthJWTPayload): string => {
  if (!conf.JWT_ACCESS_TOKEN_SECRET || !conf.JWT_EXPIRES_AFTER) {
    throw new AppError(
      'Something went wrong',
      HTTPStatusCode.InternalServerError
    );
  }

  const token: string = jwt.sign(payload, conf.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: conf.JWT_EXPIRES_AFTER,
  });

  return `Bearer ${token}`;
};

const authenticate = async (
  token: string | undefined
): Promise<IAuthJWTPayload> => {
  if (!token) {
    throw new AppError('Token is not valid', HTTPStatusCode.Unauthorized);
  }

  token = token.split(' ')[1];

  if (!conf.JWT_ACCESS_TOKEN_SECRET) {
    throw new AppError(
      'Something went wrong',
      HTTPStatusCode.InternalServerError
    );
  }

  const payload: IAuthJWTPayload = jwt.verify(
    token,
    conf.JWT_ACCESS_TOKEN_SECRET
  ) as IAuthJWTPayload;

  return payload;
};

export default {
  getToken,
  authenticate,
};

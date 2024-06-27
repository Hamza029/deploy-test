import { Response, NextFunction } from 'express';
import { HTTPStatusCode, UserRoles } from '../constants';
import { IUser, IProtectedRequest } from '../interfaces';
import userRepository from '../repository/userRepository';
import AppError from '../utils/appError';
import parseIdParam from '../utils/parseIdParam';

const authorize = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseIdParam(req);

    const user: IUser | undefined = await userRepository.getUserById(id);

    if (!user) {
      return next(
        new AppError(
          "The requested user doesn't exist",
          HTTPStatusCode.NotFound
        )
      );
    }

    if (!req.user) {
      return next(
        new AppError('Token is not valid', HTTPStatusCode.Unauthorized)
      );
    }

    if (
      user.Username !== req.user.Username &&
      req.user.Role !== UserRoles.ADMIN
    ) {
      return next(
        new AppError(
          "You don't have permission to perform this request",
          HTTPStatusCode.Forbidden
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default {
  authorize,
};

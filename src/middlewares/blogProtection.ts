import { Response, NextFunction } from 'express';
import { HTTPStatusCode, UserRoles } from '../constants';
import { IUser, IProtectedRequest, IBlog } from '../interfaces';
import userRepository from '../repository/userRepository';
import AppError from '../utils/appError';
import parseIdParam from '../utils/parseIdParam';
import blogRepository from '../repository/blogRepository';

const authorize = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseIdParam(req);

    const blog: IBlog | undefined = await blogRepository.getBlogById(id);

    if (!blog) {
      return next(
        new AppError("Requested blog doesn't exist", HTTPStatusCode.NotFound)
      );
    }

    const user: IUser | undefined = await userRepository.getUserByUsername(
      blog.authorUsername
    );

    if (!user) {
      return next(
        new AppError(
          'The author of this blog does not exist',
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
      blog.authorUsername !== req.user.Username &&
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

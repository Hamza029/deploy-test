import { Request } from 'express';
import AppError from './appError';
import { HTTPStatusCode } from '../constants';

export default (req: Request): number => {
  const { id } = req.params;
  const idNum = Number(id);

  if (!idNum) {
    throw new AppError(
      'Invalid parameter: ID must be a valid number',
      HTTPStatusCode.BadRequest
    );
  }

  return idNum;
};

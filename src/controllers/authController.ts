import { Request, Response, NextFunction } from 'express';
import authService from './../services/authService';
import { IUser, IAuthLoginResponse, IProtectedRequest } from '../interfaces';
import sendResponse from '../utils/sendResponse';
import { HTTPStatusCode } from '../constants';

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestBody = { ...req.body };
    await authService.signup(requestBody);

    sendResponse<IUser>(
      req,
      res,
      HTTPStatusCode.Created,
      'successfully signed up'
    );
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestBody = { ...req.body };

    const loginResponse: IAuthLoginResponse =
      await authService.login(requestBody);

    sendResponse<IAuthLoginResponse>(
      req,
      res,
      HTTPStatusCode.Ok,
      'logged in',
      loginResponse
    );
  } catch (err) {
    next(err);
  }
};

const updateMyPassword = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestBody = { ...req.body };
    await authService.updateMyPassword(req.user!, requestBody);
    sendResponse(req, res, HTTPStatusCode.Ok, 'successfully updated password');
  } catch (err) {
    next(err);
  }
};

export default {
  signup,
  login,
  updateMyPassword,
};

import { IBlogResponse } from './../interfaces/blog';
import { Request, Response, NextFunction } from 'express';
import blogService from '../services/blogService';
import sendResponse from '../utils/sendResponse';
import parseIdParam from '../utils/parseIdParam';
import { IProtectedRequest } from '../interfaces';
import { HTTPStatusCode } from '../constants';

const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blogs: IBlogResponse[] = await blogService.getAllBlogs(req.query);

    sendResponse<IBlogResponse[]>(
      req,
      res,
      HTTPStatusCode.Ok,
      'successfully fetched all blogs',
      blogs
    );
  } catch (err) {
    next(err);
  }
};

const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id: number = parseIdParam(req);

    const blog = await blogService.getBlogById(id);

    sendResponse<IBlogResponse>(
      req,
      res,
      HTTPStatusCode.Ok,
      'successfully fetched blog',
      blog
    );
  } catch (err) {
    next(err);
  }
};

const createBlog = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const requestBody = { ...req.body };

  try {
    await blogService.createBlog(requestBody, req.user!);

    sendResponse(
      req,
      res,
      HTTPStatusCode.Created,
      'successfully created you blog'
    );
  } catch (err) {
    next(err);
  }
};

const deleteBlogById = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseIdParam(req);

    await blogService.deleteBlogById(id);

    sendResponse(req, res, HTTPStatusCode.Ok, 'successfully deleted your blog');
  } catch (err) {
    next(err);
  }
};

const updateBlogById = async (
  req: IProtectedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const requestBody = { ...req.body };

  try {
    const id = parseIdParam(req);

    const blog: IBlogResponse = await blogService.updateBlogById(
      id,
      requestBody
    );

    sendResponse<IBlogResponse>(
      req,
      res,
      HTTPStatusCode.Ok,
      'successfully updated your blog',
      blog
    );
  } catch (err) {
    next(err);
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlogById,
  updateBlogById,
};

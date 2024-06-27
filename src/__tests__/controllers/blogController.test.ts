import { Request, Response } from 'express';
import blogController from '../../controllers/blogController';
import { IBlogResponse, IProtectedRequest, IUser } from '../../interfaces';
import blogService from '../../services/blogService';
import sendResponse from '../../utils/sendResponse';
import { HTTPStatusCode, UserRoles } from '../../constants';
import AppError from '../../utils/appError';

jest.mock('./../../services/blogService', () => {
  return {
    __esModule: true,
    default: {
      getAllBlogs: jest.fn(),
      getBlogById: jest.fn(),
      createBlog: jest.fn(),
      deleteBlogById: jest.fn(),
      updateBlogById: jest.fn(),
    },
  };
});

jest.mock('./../../utils/sendResponse', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

const mockBlogsResponse: IBlogResponse[] = [
  {
    id: 1,
    title: 'A',
    description: 'A',
    authorName: 'userA',
    authorUsername: 'userA',
  },
  {
    id: 2,
    title: 'B',
    description: 'B',
    authorName: 'userB',
    authorUsername: 'userB',
  },
];

const mockUser: IUser = {
  Id: 1,
  Username: 'userA',
  Name: 'userA',
  Email: 'a@gmail.com',
  Role: UserRoles.USER,
  JoinDate: new Date(),
};

const mockError = new AppError('Test Error', HTTPStatusCode.NotImplemented);

describe('BlogController.getAllBlogs', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockRequest: Partial<Request> = {
    query: {
      page: '2',
    },
  };
  const mockResponse: Partial<Response> = {};
  const mockNext: jest.Mock = jest.fn();

  it('should send list of blogs as response with status 200', async () => {
    (blogService.getAllBlogs as jest.Mock).mockResolvedValueOnce(
      mockBlogsResponse
    );

    await blogController.getAllBlogs(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.getAllBlogs).toHaveBeenCalledTimes(1);
    expect(blogService.getAllBlogs).toHaveBeenCalledWith(mockRequest.query);
    expect(blogService.getAllBlogs).toHaveReturnedWith(
      Promise.resolve(mockBlogsResponse)
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      HTTPStatusCode.Ok,
      'successfully fetched all blogs',
      mockBlogsResponse
    );
    expect(sendResponse).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should send empty list with status 200', async () => {
    (blogService.getAllBlogs as jest.Mock).mockRejectedValueOnce([]);

    await blogController.getAllBlogs(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.getAllBlogs).toHaveBeenCalledTimes(1);
    expect(blogService.getAllBlogs).toHaveBeenCalledWith(mockRequest.query);
    expect(blogService.getAllBlogs).toHaveReturnedWith(Promise.resolve([]));

    expect(sendResponse).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith([]);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('BlogController.getBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockRequest: Partial<Request> = {
    params: {
      id: '1',
    },
  };
  const mockResponse: Partial<Response> = {};
  const mockNext: jest.Mock = jest.fn();

  it('should send a blog response with status 200', async () => {
    (blogService.getBlogById as jest.Mock).mockResolvedValueOnce(
      mockBlogsResponse[0]
    );

    await blogController.getBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.getBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.getBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id)
    );
    expect(blogService.getBlogById).toHaveReturnedWith(
      Promise.resolve(mockBlogsResponse[0])
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      HTTPStatusCode.Ok,
      'successfully fetched blog',
      mockBlogsResponse[0]
    );
    expect(sendResponse).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should send no blogs found error through next function', async () => {
    const mockNoBlogFoundError = new AppError(
      "This blog doesn't exist",
      HTTPStatusCode.NotFound
    );

    (blogService.getBlogById as jest.Mock).mockRejectedValueOnce(
      mockNoBlogFoundError
    );

    await blogController.getBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.getBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.getBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id)
    );

    expect(sendResponse).not.toHaveBeenCalled();

    expect(mockNext).toHaveBeenCalledWith(mockNoBlogFoundError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('BlogController.updateBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockRequest: Partial<IProtectedRequest> = {
    params: {
      id: '1',
    },
    body: {
      title: 'C',
      description: 'C',
    },
  };
  const mockResponse: Partial<Response> = {};
  const mockNext: jest.Mock = jest.fn();

  const mockUpdatedBlogResponse: IBlogResponse = {
    id: 1,
    title: 'C',
    description: 'C',
    authorName: mockBlogsResponse[0].authorName,
    authorUsername: mockBlogsResponse[0].authorUsername,
  };

  it('should send response for a successful update', async () => {
    (blogService.updateBlogById as jest.Mock).mockResolvedValueOnce(
      mockUpdatedBlogResponse
    );

    await blogController.updateBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.updateBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.updateBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id),
      mockRequest.body
    );
    expect(blogService.updateBlogById).toHaveReturnedWith(
      Promise.resolve(mockUpdatedBlogResponse)
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      HTTPStatusCode.Ok,
      'successfully updated your blog',
      mockUpdatedBlogResponse
    );
    expect(sendResponse).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should send no blog found error through next function', async () => {
    const mockNoBlogFoundError = new AppError(
      "This blog doesn't exist",
      HTTPStatusCode.NotFound
    );

    (blogService.updateBlogById as jest.Mock).mockRejectedValue(
      mockNoBlogFoundError
    );

    await blogController.updateBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.updateBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.updateBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id),
      mockRequest.body
    );

    expect(sendResponse).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockNoBlogFoundError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('BlogController.createBlog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockRequest: Partial<IProtectedRequest> = {
    body: {
      title: 'A',
      description: 'A',
    },
    user: {
      ...mockUser,
    },
  };
  const mockResponse: Partial<Response> = {};
  const mockNext: jest.Mock = jest.fn();

  it('should create a blog', async () => {
    await blogController.createBlog(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.createBlog).toHaveBeenCalledTimes(1);
    expect(blogService.createBlog).toHaveBeenCalledWith(
      mockRequest.body,
      mockRequest.user
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      HTTPStatusCode.Created,
      'successfully created you blog'
    );
    expect(sendResponse).toHaveBeenCalledTimes(1);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should send an error through next function', async () => {
    (blogService.createBlog as jest.Mock).mockRejectedValueOnce(mockError);

    await blogController.createBlog(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.createBlog).toHaveBeenCalledTimes(1);
    expect(blogService.createBlog).toHaveBeenCalledWith(
      mockRequest.body,
      mockRequest.user
    );

    expect(sendResponse).not.toHaveBeenCalledWith();

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('BlogController.deleteBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockRequest: Partial<IProtectedRequest> = {
    params: {
      id: '1',
    },
  };
  const mockResponse: Partial<Response> = {};
  const mockNext: jest.Mock = jest.fn();

  it('should send response for a successful deletion', async () => {
    await blogController.deleteBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.deleteBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.deleteBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id)
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      HTTPStatusCode.Ok,
      'successfully deleted your blog'
    );
    expect(sendResponse).toHaveBeenCalledTimes(1);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should send no blog found error through next function', async () => {
    const mockNoBlogFoundError = new AppError(
      "This blog doesn't exist",
      HTTPStatusCode.NotFound
    );

    (blogService.deleteBlogById as jest.Mock).mockRejectedValue(
      mockNoBlogFoundError
    );

    await blogController.deleteBlogById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(blogService.deleteBlogById).toHaveBeenCalledTimes(1);
    expect(blogService.deleteBlogById).toHaveBeenCalledWith(
      Number(mockRequest.params!.id)
    );

    expect(sendResponse).not.toHaveBeenCalled();

    expect(mockNext).toHaveBeenCalledWith(mockNoBlogFoundError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

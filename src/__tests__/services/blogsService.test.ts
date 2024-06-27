import { HTTPStatusCode, UserRoles } from '../../constants';
import {
  IBlog,
  IBlogDbInput,
  IBlogInput,
  IBlogResponse,
  IBlogUpdateInput,
  IUser,
} from '../../interfaces';
import blogService from '../../services/blogService';
import AppError from '../../utils/appError';
import blogRepository from './../../repository/blogRepository';

jest.mock('./../../repository/blogRepository', () => {
  return {
    __esModule: true,
    default: {
      getAllBlogs: jest.fn(),
      getBlogById: jest.fn(),
      createBlog: jest.fn(),
      updateBlogById: jest.fn(),
      deleteBlogById: jest.fn(),
      getBlogsByAuthorUsername: jest.fn(),
    },
  };
});

const mockBlogs: IBlog[] = [
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

describe('blogService.getAllBlogs', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return list of blogs', async () => {
    const queryParams = {
      page: '3',
    };

    (blogRepository.getAllBlogs as jest.Mock).mockResolvedValueOnce(mockBlogs);

    const blogsResponse: IBlogResponse[] =
      await blogService.getAllBlogs(queryParams);

    expect(blogsResponse).toEqual(mockBlogsResponse);
  });

  it('should return list of blogs of page 1', async () => {
    const queryParams = {
      page: 'abcd',
    };

    (blogRepository.getAllBlogs as jest.Mock).mockResolvedValueOnce(mockBlogs);

    const blogsResponse: IBlogResponse[] =
      await blogService.getAllBlogs(queryParams);

    expect(blogsResponse).toEqual(mockBlogsResponse);
  });

  it('should return list of blogs for particular author', async () => {
    const queryParams = {
      page: '3',
      authorUsername: 'A',
    };

    (
      blogRepository.getBlogsByAuthorUsername as jest.Mock
    ).mockResolvedValueOnce(mockBlogs);

    const blogsResponse: IBlogResponse[] =
      await blogService.getAllBlogs(queryParams);

    expect(blogsResponse).toEqual(mockBlogsResponse);
  });

  it('should throw AppError with status 404', async () => {
    const queryParams = {
      page: '100',
    };

    (blogRepository.getAllBlogs as jest.Mock).mockResolvedValueOnce([]);

    await expect(blogService.getAllBlogs(queryParams)).rejects.toThrow(
      new AppError('No blogs found', HTTPStatusCode.NotFound)
    );
  });
});

describe('blogService.getBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a blog', async () => {
    const id: number = mockBlogs[0].id;

    (blogRepository.getBlogById as jest.Mock).mockResolvedValueOnce(
      mockBlogs[0]
    );

    const blogResponse: IBlogResponse | undefined =
      await blogService.getBlogById(id);

    expect(blogResponse).toEqual(mockBlogsResponse[0]);
  });

  it('should return a blog', async () => {
    const id: number = mockBlogs[0].id;

    (blogRepository.getBlogById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(blogService.getBlogById(id)).rejects.toThrow(
      new AppError("This blog doesn't exist", HTTPStatusCode.NotFound)
    );
  });
});

describe('blogService.createBlog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUser: IUser = {
    Id: 1,
    Username: 'a',
    Name: 'a',
    Email: 'a@gmail.com',
    Role: UserRoles.USER,
    JoinDate: new Date(),
  };

  const blogInput: IBlogInput = {
    title: 'A',
    description: 'A',
  };

  const blogDbInput: IBlogDbInput = {
    ...blogInput,
    authorName: mockUser.Name,
    authorUsername: mockUser.Username,
  };

  it('should create a blog', async () => {
    (blogRepository.createBlog as jest.Mock).mockResolvedValueOnce(null);

    await blogService.createBlog(blogInput, mockUser);

    expect(blogRepository.createBlog).toHaveBeenCalledWith(blogDbInput);
  });
});

describe('blogService.updateBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const id = mockBlogs[0].id;

  const blogUpdateInput: IBlogUpdateInput = {
    title: 'C',
    description: 'C',
  };

  const mockUpdatedBlog: IBlog = {
    id: mockBlogs[0].id,
    title: 'C',
    description: 'C',
    authorName: mockBlogs[0].authorName,
    authorUsername: mockBlogs[0].authorUsername,
  };

  const mockUpdatedBlogResponse: IBlogResponse = { ...mockUpdatedBlog };

  it('should update a blog', async () => {
    (blogRepository.getBlogById as jest.Mock)
      .mockResolvedValueOnce(mockBlogs[0])
      .mockResolvedValueOnce(mockUpdatedBlog);

    const blogResponse: IBlogResponse = await blogService.updateBlogById(
      id,
      blogUpdateInput
    );

    expect(blogResponse).toEqual(mockUpdatedBlogResponse);
  });

  it('should throw blog not found error', async () => {
    (blogRepository.getBlogById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(blogService.updateBlogById).rejects.toThrow(
      new AppError("This blog doesn't exist", HTTPStatusCode.NotFound)
    );
  });
});

describe('blogService.deleteBlogById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const id = mockBlogs[0].id;

  it('should delete a blog', async () => {
    (blogRepository.getBlogById as jest.Mock).mockResolvedValueOnce(
      mockBlogs[0]
    );
    (blogRepository.deleteBlogById as jest.Mock).mockResolvedValueOnce(null);

    await blogService.deleteBlogById(id);

    expect(blogRepository.deleteBlogById).toHaveBeenCalledWith(id);
  });

  it('should throw blog not found error', async () => {
    (blogRepository.getBlogById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(blogService.deleteBlogById(id)).rejects.toThrow(
      new AppError("This blog doesn't exist", HTTPStatusCode.NotFound)
    );
  });
});

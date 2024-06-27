import { HTTPStatusCode } from '../constants';
import {
  IBlog,
  IBlogDbInput,
  IBlogInput,
  IBlogQueryParams,
  IBlogResponse,
  IBlogUpdateDbInput,
  IBlogUpdateInput,
  IUser,
} from '../interfaces';
import blogRepository from '../repository/blogRepository';
import AppError from '../utils/appError';
import {
  BlogDbInputDTO,
  BlogResponseDTO,
  BlogUpdateDbInput,
} from './dtos/blog.dto';

const getAllBlogs = async (
  queryParams: IBlogQueryParams
): Promise<IBlogResponse[]> => {
  const { authorUsername } = queryParams;

  const page: number = Number(queryParams.page) || 1;

  const limit: number = 4;
  const skip: number = (page - 1) * limit;

  const blogs: IBlog[] = await (!authorUsername
    ? blogRepository.getAllBlogs(skip, limit)
    : blogRepository.getBlogsByAuthorUsername(authorUsername, skip, limit));

  if (blogs.length === 0) {
    throw new AppError('No blogs found', HTTPStatusCode.NotFound);
  }

  const blogsResponseDTO: IBlogResponse[] = blogs.map(
    (blog) => new BlogResponseDTO(blog)
  );

  return blogsResponseDTO;
};

const getBlogById = async (id: number): Promise<IBlogResponse> => {
  const blog: IBlog | undefined = await blogRepository.getBlogById(id);

  if (!blog) {
    throw new AppError("This blog doesn't exist", HTTPStatusCode.NotFound);
  }

  const blogResponseDTO: IBlogResponse = new BlogResponseDTO(blog);

  return blogResponseDTO;
};

const createBlog = async (
  blogInput: IBlogInput,
  user: IUser
): Promise<void> => {
  const blogDbInputDTO: IBlogDbInput = new BlogDbInputDTO(blogInput, user);

  await blogRepository.createBlog(blogDbInputDTO);
};

const deleteBlogById = async (id: number) => {
  const blog = await blogRepository.getBlogById(id);

  if (!blog) {
    throw new AppError("This blog doesn't exist", HTTPStatusCode.NotFound);
  }

  await blogRepository.deleteBlogById(id);
};

const updateBlogById = async (
  id: number,
  blogUpdateInput: IBlogUpdateInput
): Promise<IBlogResponse> => {
  const blog: IBlog | undefined = await blogRepository.getBlogById(id);

  if (!blog) {
    throw new AppError("This blog doesn't exist", HTTPStatusCode.NotFound);
  }

  const blogUpdateDbInput: IBlogUpdateDbInput = new BlogUpdateDbInput(
    blogUpdateInput
  );

  await blogRepository.updateBlogById(id, blogUpdateDbInput);

  const updatedBlog: IBlog | undefined = await blogRepository.getBlogById(id);

  const blogResponseDTO = new BlogResponseDTO(updatedBlog!);

  return blogResponseDTO;
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlogById,
  updateBlogById,
};

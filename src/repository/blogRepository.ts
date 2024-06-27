import db from '../database/db';
import { IBlog, IBlogDbInput, IBlogUpdateDbInput } from '../interfaces';

const getAllBlogs = async (skip: number, limit: number): Promise<IBlog[]> => {
  const blogs: IBlog[] = await db<IBlog>('Blog')
    .select('*')
    .offset(skip)
    .limit(limit);

  return blogs;
};

const getBlogById = async (id: number): Promise<IBlog | undefined> => {
  const blog: IBlog | undefined = await db<IBlog>('Blog')
    .select('*')
    .where('id', '=', id)
    .first();
  return blog;
};

const getBlogsByAuthorUsername = async (
  authorUsername: string,
  skip: number,
  limit: number
): Promise<IBlog[]> => {
  const blogs: IBlog[] = await db<IBlog>('Blog')
    .select('*')
    .where({ authorUsername: authorUsername })
    .offset(skip)
    .limit(limit);

  return blogs;
};

const createBlog = async (blogDbInput: IBlogDbInput): Promise<void> => {
  await db<IBlog>('Blog').insert(blogDbInput);
};

const deleteBlogById = async (id: number): Promise<void> => {
  await db<IBlog>('Blog').where('id', '=', id).del();
};

const updateBlogById = async (
  id: number,
  blogUpdateDbInput: IBlogUpdateDbInput
): Promise<void> => {
  await db<IBlog>('Blog').where('id', '=', id).update(blogUpdateDbInput);
};

export default {
  getAllBlogs,
  getBlogById,
  getBlogsByAuthorUsername,
  createBlog,
  deleteBlogById,
  updateBlogById,
};

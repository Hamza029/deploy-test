import express from 'express';
import { Router } from 'express';
import blogController from '../controllers/blogController';
import blogProtection from '../middlewares/blogProtection';
import authProtection from '../middlewares/authProtection';
import validator from '../validators';

const router: Router = express.Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    authProtection.authenticate,
    validator('create_blog'),
    blogController.createBlog
  );

router
  .route('/:id')
  .get(blogController.getBlogById)
  .delete(
    authProtection.authenticate,
    blogProtection.authorize,
    blogController.deleteBlogById
  )
  .patch(
    authProtection.authenticate,
    blogProtection.authorize,
    validator('blog_update'),
    blogController.updateBlogById
  );

export default router;

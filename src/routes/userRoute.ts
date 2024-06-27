import express, { Router } from 'express';

import userController from './../controllers/userController';
import userProtection from '../middlewares/userProtection';
import authProtection from '../middlewares/authProtection';
import validator from '../validators';

const router: Router = express.Router();

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .delete(
    authProtection.authenticate,
    userProtection.authorize,
    userController.deleteUserById
  )
  .get(userController.getUserById)
  .patch(
    authProtection.authenticate,
    userProtection.authorize,
    validator('user_update'),
    userController.updateUserById
  );

export default router;

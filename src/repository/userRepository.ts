import { IUser, IAuth, IUserUpdateInput } from '../interfaces';
import db from '../database/db';
import { Knex } from 'knex';
import AppError from '../utils/appError';
import { HTTPStatusCode } from '../constants';

const getAllUsers = async (skip: number, limit: number): Promise<IUser[]> => {
  const users: IUser[] = await db<IUser>('User')
    .select('*')
    .limit(limit)
    .offset(skip);

  return users;
};

const deleteUserById = async (id: number, username: string): Promise<void> => {
  const trx: Knex.Transaction = await db.transaction();

  try {
    await trx<IUser>('User').where({ Id: id }).del();
    await trx<IAuth>('Auth').where({ Username: username }).del();

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    throw new AppError(
      'An unexpected error occurred while deleting user',
      HTTPStatusCode.InternalServerError
    );
  }
};

const getUserById = async (id: number): Promise<IUser | undefined> => {
  const user: IUser | undefined = await db<IUser>('User')
    .where('Id', id)
    .select('*')
    .first();
  return user;
};

const updateUserById = async (
  id: number,
  userUpdateDbInput: IUserUpdateInput
): Promise<boolean> => {
  const userUpdated = await db<IUser>('User')
    .where('Id', '=', id)
    .update(userUpdateDbInput);

  return userUpdated === 1;
};

const getUserByUsername = async (
  username: string
): Promise<IUser | undefined> => {
  const targetUser: IUser | undefined = await db<IUser>('User')
    .where('Username', '=', username)
    .first();

  return targetUser;
};

export default {
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
  getUserByUsername,
};

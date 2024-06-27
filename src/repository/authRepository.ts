import { Knex } from 'knex';

import {
  IUserDbInput,
  IUser,
  IAuthDbInput,
  IAuth,
  IAuthInput,
  IUpdatePasswordDbInput,
} from '../interfaces';
import db from './../database/db';
import KnexError from '../utils/knexError';

const signup = async (
  userDbInput: IUserDbInput,
  authDbInput: IAuthDbInput
): Promise<void> => {
  const trx: Knex.Transaction = await db.transaction();

  try {
    await trx<IAuth>('Auth').insert(authDbInput);
    await trx<IUser>('User').insert(userDbInput);

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    throw err as KnexError;
  }
};

const login = async (authInput: IAuthInput): Promise<IAuth | undefined> => {
  const auth: IAuth | undefined = await db<IAuth>('Auth')
    .select('*')
    .where('Username', '=', authInput.Username)
    .first();

  return auth;
};

const updateMyPassword = async (
  username: string,
  updatePasswordDbInput: IUpdatePasswordDbInput
): Promise<void> => {
  await db<IAuth>('Auth')
    .update(updatePasswordDbInput)
    .where({ Username: username });
};

const getAuthByUsername = async (
  useranme: string
): Promise<IAuth | undefined> => {
  const auth: IAuth | undefined = await db<IAuth>('Auth')
    .select('*')
    .where({ Username: useranme })
    .first();
  return auth;
};

export default {
  signup,
  login,
  updateMyPassword,
  getAuthByUsername,
};

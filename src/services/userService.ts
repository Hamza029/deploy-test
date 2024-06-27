import { HTTPStatusCode } from '../constants';
import {
  IUser,
  IUserResponse,
  IUserUpdateDbInput,
  IUserUpdateInput,
} from '../interfaces';
import { IUserQueryParams } from '../interfaces/queryParams';
import AppError from '../utils/appError';
import userRepository from './../repository/userRepository';
import { UserResponseDTO, UserUpdateDBInputDTO } from './dtos/user.dto';

const getAllUsers = async (
  queryParams: IUserQueryParams
): Promise<IUserResponse[]> => {
  const page: number = Number(queryParams.page) || 1;

  const limit: number = 4;
  const skip: number = (page - 1) * limit;

  const users: IUser[] = await userRepository.getAllUsers(skip, limit);

  const usersResponseDTO: IUserResponse[] = users.map(
    (user) => new UserResponseDTO(user)
  );

  return usersResponseDTO;
};

const deleteUserById = async (id: number): Promise<void> => {
  const user: IUser | undefined = await userRepository.getUserById(id);

  if (!user) {
    throw new AppError('User not found', HTTPStatusCode.NotFound);
  }

  await userRepository.deleteUserById(id, user.Username);
};

const getUserById = async (id: number): Promise<IUserResponse> => {
  const user: IUser | undefined = await userRepository.getUserById(id);

  if (!user) {
    throw new AppError('User not found', HTTPStatusCode.NotFound);
  }

  const userResponseDTO = new UserResponseDTO(user);

  return userResponseDTO;
};

const updateUserById = async (
  id: number,
  userUpdateInput: IUserUpdateInput
): Promise<IUserResponse> => {
  const user: IUser | undefined = await userRepository.getUserById(id);

  if (!user) {
    throw new AppError('User not found', HTTPStatusCode.NotFound);
  }

  const userUpdateDbInputDTO: IUserUpdateDbInput = new UserUpdateDBInputDTO(
    userUpdateInput
  );

  const userUpdated: boolean = await userRepository.updateUserById(
    id,
    userUpdateDbInputDTO
  );

  if (!userUpdated) {
    throw new AppError(
      'An unexpected error occurred while updating user',
      HTTPStatusCode.InternalServerError
    );
  }

  user.Name = userUpdateDbInputDTO.Name;

  const userResponseDTO: IUserResponse = new UserResponseDTO(user);

  return userResponseDTO;
};

export default {
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
};

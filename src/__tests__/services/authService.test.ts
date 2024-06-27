import {
  IAuth,
  IAuthLoginResponse,
  IUpdatePasswordInput,
} from './../../interfaces/auth';
import { HTTPStatusCode, UserRoles } from '../../constants';
import { IAuthInput, IUser, IUserInput } from '../../interfaces';
import authRepository from './../../repository/authRepository';
import authService from '../../services/authService';
import passwordUtil from './../../utils/passwordUtil';
import userRepository from './../../repository/userRepository';
import jwtUtil from '../../utils/jwtUtil';
import AppError from '../../utils/appError';

jest.mock('./../../repository/authRepository', () => {
  return {
    __esModule: true,
    default: {
      signup: jest.fn(),
      login: jest.fn(),
      getAuthByUsername: jest.fn(),
      updateMyPassword: jest.fn(),
    },
  };
});

jest.mock('./../../repository/userRepository', () => {
  return {
    __esModule: true,
    default: {
      getAllUsers: jest.fn(),
      deleteUserById: jest.fn(),
      getUserById: jest.fn(),
      updateUserById: jest.fn(),
      getUserByUsername: jest.fn(),
    },
  };
});

jest.mock('./../../utils/passwordUtil', () => {
  return {
    __esModule: true,
    default: {
      hash: jest.fn(),
      compare: jest.fn(),
    },
  };
});

jest.mock('./../../utils/jwtUtil', () => {
  return {
    __esModule: true,
    default: {
      getToken: jest.fn(),
      authenticate: jest.fn(),
    },
  };
});

describe('AuthService.signup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUserInput: IUserInput = {
    Username: 'a',
    Name: 'a',
    Email: 'a@gmail.com',
    Password: '1234',
  };

  it('should resolve successfully without any error', async () => {
    (passwordUtil.hash as jest.Mock).mockResolvedValueOnce('hashed');

    expect(authService.signup(mockUserInput)).resolves;
  });
});

describe('AuthService.login', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockAuthInput: IAuthInput = {
    Username: 'a',
    Password: '1234',
  };

  const mockAuth: IAuth = {
    Id: 1,
    Username: 'a',
    Password: 'hashed',
    PasswordModifiedAt: new Date(),
  };

  const mockUser: IUser = {
    Id: 1,
    Username: 'a',
    Name: 'a',
    Email: 'a@gmail.com',
    Role: UserRoles.USER,
    JoinDate: new Date(),
  };

  const mockToken: string = 'Bearer jwt_token_demo';

  const mockLoginResponse: IAuthLoginResponse = {
    Token: mockToken,
  };

  it('should return jwt token', async () => {
    (authRepository.login as jest.Mock).mockResolvedValueOnce(mockAuth);
    (passwordUtil.compare as jest.Mock).mockResolvedValueOnce(true);
    (userRepository.getUserByUsername as jest.Mock).mockResolvedValueOnce(
      mockUser
    );
    (jwtUtil.getToken as jest.Mock).mockReturnValueOnce(mockToken);

    const loginResponse: IAuthLoginResponse | undefined =
      await authService.login(mockAuthInput);

    expect(loginResponse).toEqual(mockLoginResponse);
  });

  it('should throw wrong username or password error', async () => {
    (authRepository.login as jest.Mock).mockResolvedValueOnce(mockAuth);
    (passwordUtil.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(authService.login(mockAuthInput)).rejects.toThrow(
      new AppError('Wrong username or password', HTTPStatusCode.Unauthorized)
    );
  });

  it('should throw wrong username or password error', async () => {
    (authRepository.login as jest.Mock).mockResolvedValueOnce(undefined);
    (passwordUtil.compare as jest.Mock).mockResolvedValueOnce(true);

    await expect(authService.login(mockAuthInput)).rejects.toThrow(
      new AppError('Wrong username or password', HTTPStatusCode.Unauthorized)
    );
  });

  it('should throw wrong username or password error', async () => {
    (authRepository.login as jest.Mock).mockResolvedValueOnce(mockAuth);
    (passwordUtil.compare as jest.Mock).mockReturnValueOnce(true);
    (userRepository.getUserByUsername as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    await expect(authService.login(mockAuthInput)).rejects.toThrow(
      new AppError('Wrong username or password', HTTPStatusCode.Unauthorized)
    );
  });
});

describe('AuthService.updateMyPassword', () => {
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

  const mockReqBody: IUpdatePasswordInput = {
    currentPassword: '1234',
    newPassword: '5678',
  };

  const mockAuth: IAuth = {
    Id: 1,
    Username: 'a',
    Password: 'hashed_old_password',
    PasswordModifiedAt: new Date(),
  };

  const mockNewHashedPassword: string = 'hashed_new_password';

  it('should successfully resolve without any error', async () => {
    (authRepository.getAuthByUsername as jest.Mock).mockResolvedValueOnce(
      mockAuth
    );
    (passwordUtil.compare as jest.Mock).mockResolvedValueOnce(true);
    (passwordUtil.hash as jest.Mock).mockResolvedValueOnce(
      mockNewHashedPassword
    );

    expect(authService.updateMyPassword(mockUser, mockReqBody)).resolves;
  });

  it('should throw wrong current password error', async () => {
    (authRepository.getAuthByUsername as jest.Mock).mockResolvedValueOnce(
      mockAuth
    );
    (passwordUtil.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      authService.updateMyPassword(mockUser, mockReqBody)
    ).rejects.toThrow(
      new AppError(
        'Your current password is incorrect',
        HTTPStatusCode.BadRequest
      )
    );
  });
});

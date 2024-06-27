import bcrypt from 'bcryptjs';

const hash = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  const salt: string = await bcrypt.genSalt(saltRounds);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const compare = async (plainPassword: string, hashedPassword: string) => {
  const isSame: boolean = await bcrypt.compare(plainPassword, hashedPassword);

  return isSame;
};

export default {
  hash,
  compare,
};

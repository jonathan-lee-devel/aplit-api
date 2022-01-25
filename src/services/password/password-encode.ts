import bcrypt from 'bcrypt';

export const passwordEncode = async (
    salt: string,
    password: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

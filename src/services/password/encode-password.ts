import bcrypt from 'bcrypt';

export const makeEncodePassword = (salt: string) => {
  return async function encodePassword(
      password: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  };
};

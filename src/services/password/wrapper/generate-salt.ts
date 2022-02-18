import bcrypt from 'bcrypt';

export const makeGenerateSalt = () => {
  return async function generateSalt(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt((err, salt) => {
        if (err) return reject(err);
        return resolve(salt);
      });
    });
  };
};

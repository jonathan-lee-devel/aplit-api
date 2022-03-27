import bcrypt from 'bcrypt';
import {GenerateSaltFunction} from '../index';

/**
 * Maker-function for generate salt wrapper function.
 *
 * @return {GenerateSaltFunction} wrapper function for generating salt
 */
export const makeGenerateSalt = (): GenerateSaltFunction => {
  /**
   * Wrapper function for generating salt.
   *
   * @return {Promise<string>} generated salt
   */
  return async function generateSalt(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt((err, salt) => {
        if (err) return reject(err);
        return resolve(salt);
      });
    });
  };
};

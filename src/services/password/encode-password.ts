import bcrypt from 'bcrypt';
import {EncodePasswordFunction} from './index';

/**
 * Maker-function to encode password.
 *
 * @param {string} salt used to hash password
 * @return {EncodePasswordFunction} function to encode password
 */
export const makeEncodePassword = (
    salt: string,
): EncodePasswordFunction => {
  /**
   * Function to encode password.
   *
   * @param {string} password to be encoded
   * @return {Promise<string>} encoded password
   */
  return async function encodePassword(
      password: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  };
};

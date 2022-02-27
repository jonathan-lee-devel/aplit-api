import {PasswordResetToken} from '../../models/PasswordResetToken';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';

/**
 * Maker-function to generate password reset token.
 *
 * @return {Function} function to generate password reset token
 */
export const makeGeneratePasswordResetToken = () => {
  /**
   * Function to generate password reset token.
   *
   * @param {number} tokenSize size of the token to generate
   * @param {number} expiryTimeMinutes number of minutes before token expires
   * @return {Promise<PasswordResetToken>} generated token
   */
  return async function generatePasswordResetToken(
      tokenSize: number,
      expiryTimeMinutes: number,
  ): Promise<PasswordResetToken> {
    return {
      value: randomBytes(tokenSize).toString('hex'),
      expiryDate: addMinutes(new Date(), expiryTimeMinutes),
      user: null,
    };
  };
};

import {PasswordResetToken} from '../../models/password/PasswordResetToken';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';
import {GeneratePasswordResetTokenFunction} from './index';

/**
 * Maker-function to generate password reset token.
 *
 * @return {GeneratePasswordResetTokenFunction} to generate password reset token
 */
export const makeGeneratePasswordResetToken = (
): GeneratePasswordResetTokenFunction => {
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

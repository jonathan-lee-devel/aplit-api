import {
  RegistrationVerificationToken,
} from '../../models/RegistrationVerificationToken';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';

/**
 * Maker-function to generate registration verification token.
 *
 * @return {Function} function to generate registration verification token
 */
export const makeGenerateRegistrationVerificationToken = () => {
  /**
   * Function to generate registration verification token.
   *
   * @param {number} tokenSize size of the token generated
   * @param {number} expiryTimeMinutes time for token to expire in minutes
   * @return {Promise<RegistrationVerificationToken>} token generated
   */
  return async function generateRegistrationVerificationToken(
      tokenSize: number,
      expiryTimeMinutes: number,
  ): Promise<RegistrationVerificationToken> {
    return {
      value: randomBytes(tokenSize).toString('hex'),
      expiryDate: addMinutes(new Date(), expiryTimeMinutes),
      user: null,
    };
  };
};

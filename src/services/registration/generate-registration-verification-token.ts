import {
  RegistrationVerificationToken,
} from '../../models/RegistrationVerificationToken';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';

export const makeGenerateRegistrationVerificationToken = () => {
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

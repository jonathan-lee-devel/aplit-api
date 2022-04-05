import {Model} from 'mongoose';
import {RegistrationVerificationToken}
  from '../../../models/registration/RegistrationVerificationToken';
import {
  GenerateAndPersistRegistrationVerificationTokenFunction,
  GenerateRegistrationVerificationTokenFunction,
} from '../index';
import {DEFAULT_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';

export const makeGenerateAndPersistRegistrationVerificationToken = (
    RegistrationVerificationTokenModel: Model<RegistrationVerificationToken>,
    generateRegistrationVerificationToken
        : GenerateRegistrationVerificationTokenFunction,
): GenerateAndPersistRegistrationVerificationTokenFunction => {
  return async function() {
    return new RegistrationVerificationTokenModel(
        await generateRegistrationVerificationToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES,
        ),
    ).save();
  };
};

import {Model} from 'mongoose';
import {DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';
import {PasswordResetToken} from '../../../models/password/PasswordResetToken';
import {GeneratePasswordResetTokenFunction} from '../../password';
import {GenerateAndPersistExpiredPasswordResetVerificationToken}
  from '../index';

export const makeGenerateAndPersistExpiredPasswordResetVerificationToken = (
    PasswordResetTokenModel: Model<PasswordResetToken>,
    generatePasswordResetToken: GeneratePasswordResetTokenFunction,
): GenerateAndPersistExpiredPasswordResetVerificationToken => {
  return async function() {
    return new PasswordResetTokenModel(
        await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            0,
        ),
    ).save();
  };
};

import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../../models/User';
import {
  PasswordResetToken,
  PasswordResetTokenModel,
} from '../../models/PasswordResetToken';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';
import {Logger} from '../../generic/Logger';

export const makeResetPassword = (
    logger: Logger,
    generatePasswordResetToken: {
      (tokenSize: number,
       expiryTimeMinutes: number
      ): Promise<PasswordResetToken>;
      },
    sendMail: {
      (addressTo: string,
       subject: string,
       text: string
      ): Promise<boolean>;
      },
) => {
  return async function resetPassword(
      email: string,
  ): Promise<PasswordResetStatus> {
    const existingUser: HydratedDocument<User> =
        await UserModel.findOne({email});
    if (!existingUser) {
      return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
    }

    const passwordResetTokenDocument: HydratedDocument<PasswordResetToken> =
        await PasswordResetTokenModel.findOne({user: existingUser});

    if (!passwordResetTokenDocument) {
      console.error('Password reset token does not exist for user');
      return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
    }

    const newPasswordResetToken =
        await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES);

    passwordResetTokenDocument.value = newPasswordResetToken.value;
    passwordResetTokenDocument.expiryDate = newPasswordResetToken.expiryDate;

    await passwordResetTokenDocument.save();

    sendMail(email, 'Password Reset',
        // eslint-disable-next-line max-len
        `Please click the following link to reset your password: ${process.env.FRONT_END_URL}/password/reset/confirm?token=${passwordResetTokenDocument.value}`);

    return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
  };
};

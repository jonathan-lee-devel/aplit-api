import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument} from 'mongoose';
import {PasswordResetToken} from '../../models/PasswordResetToken';
import {User} from '../../models/User';

export const makeConfirmPasswordReset = (
    passwordResetTokenModel: any,
    userModel: any,
    encodePassword: { (password: string): Promise<string>; },
) => {
  return async function confirmPasswordReset(
      token: string,
      password: string,
  ): Promise<PasswordResetStatus> {
    const foundToken: HydratedDocument<PasswordResetToken> =
        await passwordResetTokenModel.findOne({value: token});

    if (!foundToken) {
      return PasswordResetStatus.INVALID_TOKEN;
    }

    const user: HydratedDocument<User> =
        await userModel.findOne({value: token});

    if (!user) {
      return PasswordResetStatus.FAILURE;
    }

    if (foundToken.expiryDate.getTime() > new Date().getTime()) {
      user.password = await encodePassword(password);
      await user.save();
      foundToken.expiryDate = new Date();
      await foundToken.save();
      return PasswordResetStatus.SUCCESS;
    }
    return PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED;
  };
};

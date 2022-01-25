import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument} from 'mongoose';
import {
  PasswordResetToken,
  PasswordResetTokenModel,
} from '../../models/PasswordResetToken';
import {User, UserModel} from '../../models/User';
import {passwordEncode} from '../password/password-encode';

export const passwordResetConfirm = async (
    token: string,
    salt: string,
    password: string,
): Promise<PasswordResetStatus> => {
  const foundToken: HydratedDocument<PasswordResetToken> =
    await PasswordResetTokenModel.findOne({value: token});

  if (!foundToken) {
    return PasswordResetStatus.INVALID_TOKEN;
  }

  const user: HydratedDocument<User> = await UserModel.findOne({
    passwordResetToken: foundToken.id,
  });

  if (!user) {
    return PasswordResetStatus.FAILURE;
  }

  if (foundToken.expiryDate.getTime() > new Date().getTime()) {
    user.password = await passwordEncode(salt, password);
    await user.save();
    foundToken.expiryDate = new Date();
    await foundToken.save();
    return PasswordResetStatus.SUCCESS;
  }
  return PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED;
};

import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument} from 'mongoose';
import {PasswordResetToken} from '../../models/password/PasswordResetToken';
import {User} from '../../models/User';

/**
 * Maker-function for confirming password reset.
 *
 * @param {PasswordResetTokenModel} passwordResetTokenModel token model
 * @param {UserModel} userModel user model
 * @param {Function} encodePassword used to encode password
 * @return {Function} function for confirming password reset
 */
export const makeConfirmPasswordReset = (
    passwordResetTokenModel: any,
    userModel: any,
    encodePassword: { (password: string): Promise<string>; },
) => {
  /**
   * Function for confirming password reset.
   *
   * @param {string} token token presented to attempt to confirm password reset
   * @param {string} password presented to be used to confirm password reset
   * @return {Promise<PasswordResetStatus>} password reset status on attempt
   */
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

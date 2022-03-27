import {PasswordResetStatus} from './enum/password-reset-status';
import {HydratedDocument, Model} from 'mongoose';
import {PasswordResetToken} from '../../models/password/PasswordResetToken';
import {User} from '../../models/User';
import {ConfirmPasswordResetFunction, EncodePasswordFunction} from './index';

/**
 * Maker-function for confirming password reset.
 *
 * @param {Model<PasswordResetToken>} passwordResetTokenModel token model
 * @param {Model<User>} UserModel user model
 * @param {EncodePasswordFunction} encodePassword used to encode password
 * @return {ConfirmPasswordResetFunction} function for confirming password reset
 */
export const makeConfirmPasswordReset = (
    passwordResetTokenModel: Model<PasswordResetToken>,
    UserModel: Model<User>,
    encodePassword: EncodePasswordFunction,
): ConfirmPasswordResetFunction => {
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
        await UserModel.findOne({value: token});

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

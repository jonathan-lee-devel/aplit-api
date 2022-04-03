import {RegistrationStatus} from './enum/registration-status';
import {HydratedDocument, Model} from 'mongoose';
import {
  RegistrationVerificationToken,
} from '../../models/registration/RegistrationVerificationToken';
import {User} from '../../models/User';
import {ConfirmRegistrationFunction} from './index';

/**
 * Maker-function to confirm registration.
 *
 * @param {Model<RegistrationVerificationToken>} RegistrationVerificationTokenModel
 * @param {Model<User>} UserModel user model
 * @return {ConfirmRegistrationFunction} function used to confirm registration
 */
export const makeConfirmRegistration = (
    RegistrationVerificationTokenModel: Model<RegistrationVerificationToken>,
    UserModel: Model<User>,
): ConfirmRegistrationFunction => {
  /**
   * Function used to confirm registration.
   *
   * @param {string} token presented to confirm registration
   * @return {Promise<RegistrationStatus>} status of the confirmation attempt
   */
  return async function confirmRegistration(
      token: string,
  ): Promise<RegistrationStatus> {
    const foundToken: HydratedDocument<RegistrationVerificationToken> =
        await RegistrationVerificationTokenModel.findOne({value: token});

    if (!foundToken) {
      return RegistrationStatus.INVALID_TOKEN;
    }

    const user: HydratedDocument<User> = await UserModel.findOne({
      registrationVerificationToken: foundToken.id,
    });

    if (!user) {
      return RegistrationStatus.FAILURE;
    }

    if (foundToken.expiryDate.getTime() > new Date().getTime()) {
      user.emailVerified = true;
      await user.save();
      foundToken.expiryDate = new Date();
      await foundToken.save();
      return RegistrationStatus.SUCCESS;
    }
    return RegistrationStatus.EMAIL_VERIFICATION_EXPIRED;
  };
};

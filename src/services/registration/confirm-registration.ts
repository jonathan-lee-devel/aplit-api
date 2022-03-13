import {RegistrationStatus} from './enum/registration-status';
import {HydratedDocument} from 'mongoose';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from '../../models/registration/RegistrationVerificationToken';
import {User, UserModel} from '../../models/User';

/**
 * Maker-function to confirm registration.
 *
 * @return {Function} function used to confirm registration
 */
export const makeConfirmRegistration = () => {
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

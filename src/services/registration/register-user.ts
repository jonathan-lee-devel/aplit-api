import {HydratedDocument} from 'mongoose';
import {RegistrationStatus} from './enum/registration-status';
import {User, UserModel} from '../../models/User';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from '../../models/registration/RegistrationVerificationToken';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';
import {PasswordResetToken, PasswordResetTokenModel}
  from '../../models/password/PasswordResetToken';
import {Logger} from '../../generic/Logger';
import {Mailer} from '../../generic/Mailer';

/**
 * Maker-function to register user.
 *
 * @param {Logger} logger used for logging
 * @param {Mailer} mailer used to send mail
 * @param {Function} generateRegistrationVerificationToken used for token
 * @param {Function} generatePasswordResetToken used to generate token
 * @return {Function} function to register user
 */
export const makeRegisterUser = (
    logger: Logger,
    mailer: Mailer,
    generateRegistrationVerificationToken: {
      (tokenSize: number, expiryTimeMinutes: number)
          : Promise<RegistrationVerificationToken>;
      },
    generatePasswordResetToken: {
      (tokenSize: number, expiryTimeMinutes: number)
          : Promise<PasswordResetToken>;
      },
) => {
  /**
  * Function to register user.
   *
   * @param {string} email email of user to register
   * @param {string} firstName first name of user to register
   * @param {string} lastName last name of user to register
   * @param {string} hashedPassword hashed password for user to register
   * @return {Promise<RegistrationStatus>} status of the registration attempt
  */
  return async function registerUser(
      email: string,
      firstName: string,
      lastName: string,
      hashedPassword: string,
  ): Promise<RegistrationStatus> {
    if (!(await handleExistingUser(email))) {
      return RegistrationStatus.USER_ALREADY_EXISTS;
    }

    const registrationVerificationTokenDocument =
        await new RegistrationVerificationTokenModel(
            await generateRegistrationVerificationToken(
                DEFAULT_TOKEN_SIZE,
                DEFAULT_EXPIRY_TIME_MINUTES,
            ),
        ).save();

    // Generate an expired token to satisfy user requirement
    const passwordResetVerificationTokenDocument =
        await new PasswordResetTokenModel(
            await generatePasswordResetToken(
                DEFAULT_TOKEN_SIZE,
                0,
            ),
        ).save();

    const newUser = new UserModel({
      email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      emailVerified: false,
      registrationVerificationToken: registrationVerificationTokenDocument.id,
      passwordResetToken: passwordResetVerificationTokenDocument.id,
    });

    await newUser.save();

    registrationVerificationTokenDocument.user = newUser;
    await registrationVerificationTokenDocument.save();

    passwordResetVerificationTokenDocument.user = newUser;
    await passwordResetVerificationTokenDocument.save();

    mailer.sendMail(email, 'Registration Confirmation',
        // eslint-disable-next-line max-len
        `<h4>Please click the following link to verify your account: <a href="${process.env.BACK_END_URL}/users/register/confirm?token=${registrationVerificationTokenDocument.value}">Verify Account</a></h4>`);

    return RegistrationStatus.AWAITING_EMAIL_VERIFICATION;
  };
};

/**
 * Helper function used to handle case of existing user.
 *
 * @param {string} email email for which case is to be checked
 * @return {Promise<boolean>} flag to indicate if user existed
 */
const handleExistingUser = async (email: string): Promise<boolean> => {
  const existingUser: HydratedDocument<User> = await UserModel.findOne({
    email,
  });

  if (existingUser) {
    if (existingUser.emailVerified) {
      return false;
    } else {
      await UserModel.findByIdAndDelete(existingUser.id);
    }
  }

  return true;
};

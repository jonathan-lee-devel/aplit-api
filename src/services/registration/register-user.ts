import {Model} from 'mongoose';
import {RegistrationStatus} from './enum/registration-status';
import {User} from '../../models/User';
import {Logger} from '../../generic/Logger';
import {SendMailFunction} from '../email';
import {
  GenerateAndPersistExpiredPasswordResetVerificationToken,
  GenerateAndPersistRegistrationVerificationTokenFunction,
  HandleExistingUserFunction,
  RegisterUserFunction,
}
  from './index';

/**
 * Maker-function to register user.
 *
 * @param {Logger} logger used for logging
 * @param {HandleExistingUserFunction} handleExistingUser
 * @param {GenerateAndPersistRegistrationVerificationTokenFunction} generateAndPersistRegistrationVerificationToken
 * @param {GenerateAndPersistExpiredPasswordResetVerificationToken} generateAndPersistExpiredPasswordResetVerificationToken
 * @param {SendMailFunction} sendMail used to send mail
 * @param {Model<User>} UserModel user model
 * @return {RegisterUserFunction} function to register user
 */
export const makeRegisterUser = (
    logger: Logger,
    handleExistingUser: HandleExistingUserFunction,
    generateAndPersistRegistrationVerificationToken
        : GenerateAndPersistRegistrationVerificationTokenFunction,
    generateAndPersistExpiredPasswordResetVerificationToken
    : GenerateAndPersistExpiredPasswordResetVerificationToken,
    sendMail: SendMailFunction,
    UserModel: Model<User>,
): RegisterUserFunction => {
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
        await generateAndPersistRegistrationVerificationToken();

    const passwordResetVerificationTokenDocument =
        await generateAndPersistExpiredPasswordResetVerificationToken();

    const newUser = new UserModel({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      emailVerified: false,
      registrationVerificationToken: registrationVerificationTokenDocument.id,
      passwordResetToken: passwordResetVerificationTokenDocument.id,
    });

    await newUser.save();

    // @ts-ignore
    registrationVerificationTokenDocument.user = newUser;
    await registrationVerificationTokenDocument.save();

    // @ts-ignore
    passwordResetVerificationTokenDocument.user = newUser;
    await passwordResetVerificationTokenDocument.save();

    sendMail(email, 'Registration Confirmation',
        // @ts-ignore
        `<h4>Please click the following link to verify your account: <a href="${process.env.FRONT_END_URL}/register/verify/${registrationVerificationTokenDocument.value}">Verify Account</a></h4>`);

    return RegistrationStatus.AWAITING_EMAIL_VERIFICATION;
  };
};

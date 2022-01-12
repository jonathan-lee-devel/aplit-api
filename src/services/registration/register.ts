import {HydratedDocument} from 'mongoose';
import {RegistrationStatus} from './enum/status';
import {User, UserModel} from '../../models/User';
import {sendMail} from '../email/send';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  generateRegistrationVerificationToken,
} from '../registration-verification-token/generate';
import {
  RegistrationVerificationTokenModel,
} from '../../models/RegistrationVerificationToken';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';
import {PasswordResetTokenModel} from '../../models/PasswordResetToken';
import {generatePasswordResetToken} from '../password-reset-token/generate';

export const registerUser = async (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    email: string,
    firstname: string,
    lastname: string,
    hashedPassword: string,
): Promise<RegistrationStatus> => {
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
    firstName: firstname,
    lastName: lastname,
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

  sendMail(
      transporter,
      email,
      'Registration Confirmation',
      `Please click the following link to verify your account: http://localhost:3000/users/register/confirm?token=${registrationVerificationTokenDocument.value}`,
  );

  return RegistrationStatus.AWAITING_EMAIL_VERIFICATION;
};

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

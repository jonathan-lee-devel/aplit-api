import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {PasswordResetStatus} from './enum/status';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../../models/User';
import {PasswordResetTokenModel} from '../../models/PasswordResetToken';
import {generatePasswordResetToken} from '../password-reset-token/generate';
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from '../../config/Token';
import {sendMail} from '../email/send';

export const resetPassword = async (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    email: string,
): Promise<PasswordResetStatus> => {
  const existingUser: HydratedDocument<User> = await UserModel.findOne({email});
  if (!existingUser) {
    return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
  }

  const passwordResetTokenDocument =
    await new PasswordResetTokenModel(
        await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES,
        ),
    ).save();

  existingUser.passwordResetToken = passwordResetTokenDocument.id;

  await existingUser.save();

  sendMail(transporter, email, 'Password Reset',
      `Please click the following link to reset your password: http://localhost:3000/users/password/reset?token=${passwordResetTokenDocument.value}`);

  return PasswordResetStatus.AWAITING_EMAIL_VERIFICATION;
};

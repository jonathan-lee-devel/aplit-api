import {makeEncodePassword} from './encode-password';
import {makeResetPassword} from './reset-password';
import {makeConfirmPasswordReset} from './confirm-password-reset';
import {makeGeneratePasswordResetToken} from './generate-password-reset-token';
import {makeGenerateSalt} from './wrapper/generate-salt';
import {PasswordResetTokenModel}
  from '../../models/password/PasswordResetToken';
import {UserModel} from '../../models/User';
import {loggerConfig} from '../../config/Logger';
import {mailerConfig} from '../../config/Mail';

const logger = loggerConfig();
const mailer = mailerConfig();

export const generateSalt = makeGenerateSalt();
export const generatePasswordResetToken = makeGeneratePasswordResetToken();
export const encodePassword = makeEncodePassword(await generateSalt());
export const resetPassword = makeResetPassword(
    logger,
    generatePasswordResetToken,
    mailer,
    UserModel,
    PasswordResetTokenModel,
);
export const confirmPasswordReset = makeConfirmPasswordReset(
    PasswordResetTokenModel,
    UserModel,
    encodePassword,
);

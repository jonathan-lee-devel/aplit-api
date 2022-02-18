import {makeEncodePassword} from './encode-password';
import {makeResetPassword} from './reset-password';
import {makeConfirmPasswordReset} from './confirm-password-reset';
import {makeGeneratePasswordResetToken} from './generate-password-reset-token';
import {makeGenerateSalt} from './wrapper/generate-salt';
import {sendMail} from '../email';
import {PasswordResetTokenModel} from '../../models/PasswordResetToken';
import {UserModel} from '../../models/User';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();


export const generateSalt = makeGenerateSalt();
export const generatePasswordResetToken = makeGeneratePasswordResetToken();
export const encodePassword = makeEncodePassword(await generateSalt());
export const resetPassword = makeResetPassword(
    logger,
    generatePasswordResetToken,
    sendMail,
);
export const confirmPasswordReset = makeConfirmPasswordReset(
    PasswordResetTokenModel,
    UserModel,
    encodePassword,
);

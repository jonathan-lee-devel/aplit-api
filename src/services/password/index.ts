import {makeEncodePassword} from './encode-password';
import {makeResetPassword} from './reset-password';
import {makeConfirmPasswordReset} from './confirm-password-reset';
import {makeGeneratePasswordResetToken} from './generate-password-reset-token';
import {makeGenerateSalt} from './wrapper/generateSalt';
import {loggerConfig} from '../../config/Logger';
import {sendMail} from '../email';

const logger = loggerConfig();

const generateSalt = makeGenerateSalt();
const generatePasswordResetToken = makeGeneratePasswordResetToken();

export const encodePassword = makeEncodePassword(await generateSalt());
export const resetPassword = makeResetPassword(
    logger,
    generatePasswordResetToken,
    sendMail,
);
export const confirmPasswordReset = makeConfirmPasswordReset(encodePassword);

import {makeEncodePassword} from './encode-password';
import {makeResetPassword} from './reset-password';
import {makeConfirmPasswordReset} from './confirm-password-reset';
import {makeGeneratePasswordResetToken} from './generate-password-reset-token';
import {makeGenerateSalt} from './wrapper/generate-salt';
import {PasswordResetToken, PasswordResetTokenModel}
  from '../../models/password/PasswordResetToken';
import {UserModel} from '../../models/User';
import {loggerConfig} from '../../config/Logger';
import {sendMail} from '../email';
import {PasswordResetStatus} from './enum/password-reset-status';

const logger = loggerConfig();

export type GenerateSaltFunction = () => Promise<string>;
export const generateSalt = makeGenerateSalt();

export type GeneratePasswordResetTokenFunction = (
    tokenSize: number,
    expiryTimeMinutes: number,
) => Promise<PasswordResetToken>;
export const generatePasswordResetToken = makeGeneratePasswordResetToken();

export type EncodePasswordFunction = (
    password: string,
) => Promise<string>;
export const encodePassword = makeEncodePassword(await generateSalt());

export type ResetPasswordFunction = (
    email: string,
) => Promise<PasswordResetStatus>;
export const resetPassword = makeResetPassword(
    logger,
    generatePasswordResetToken,
    sendMail,
    UserModel,
    PasswordResetTokenModel,
);

export type ConfirmPasswordResetFunction = (
    token: string,
    password: string,
) => Promise<PasswordResetStatus>;
export const confirmPasswordReset = makeConfirmPasswordReset(
    PasswordResetTokenModel,
    UserModel,
    encodePassword,
);

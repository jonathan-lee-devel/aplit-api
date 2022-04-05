import {makeConfirmRegistration} from './confirm-registration';
import {makeGenerateRegistrationVerificationToken}
  from './generate-registration-verification-token';
import {makeRegisterUser} from './register-user';
import {generatePasswordResetToken} from '../password';
import {loggerConfig} from '../../config/Logger';
import {UserModel} from '../../models/User';
import {sendMail} from '../email';
import {RegistrationStatus} from './enum/registration-status';
import {RegistrationVerificationToken, RegistrationVerificationTokenModel} from
  '../../models/registration/RegistrationVerificationToken';
import {Document} from 'mongoose';
import {
  makeGenerateAndPersistRegistrationVerificationToken,
} from './helpers/generate-and-persist-registration-verification-token';
import {PasswordResetToken, PasswordResetTokenModel}
  from '../../models/password/PasswordResetToken';
import {
  makeGenerateAndPersistExpiredPasswordResetVerificationToken,
} from './helpers/generate-and-persist-password-reset-verification-token';
import {makeHandleExistingUser} from './helpers/handle-existing-user';

const logger = loggerConfig();

export type GenerateRegistrationVerificationTokenFunction = (
    tokenSize: number,
    expiryTimeMinutes: number,
) => Promise<RegistrationVerificationToken>;
const generateRegistrationVerificationToken =
    makeGenerateRegistrationVerificationToken();

export type ConfirmRegistrationFunction = (
    token: string,
) => Promise<RegistrationStatus>;
export const confirmRegistration = makeConfirmRegistration(
    RegistrationVerificationTokenModel,
    UserModel,
);

export type GenerateAndPersistRegistrationVerificationTokenFunction = (
) => Promise<Document<any, any, RegistrationVerificationToken>>;
const generateAndPersistRegistrationVerificationToken =
    makeGenerateAndPersistRegistrationVerificationToken(
        RegistrationVerificationTokenModel,
        generateRegistrationVerificationToken,
    );

export type GenerateAndPersistExpiredPasswordResetVerificationToken = (
) => Promise<Document<any, any, PasswordResetToken>>;
const generateAndPersistExpiredPasswordResetVerificationToken =
    makeGenerateAndPersistExpiredPasswordResetVerificationToken(
        PasswordResetTokenModel,
        generatePasswordResetToken,
    );

export type HandleExistingUserFunction = (
    email: string,
) => Promise<boolean>;
const handleExistingUser = makeHandleExistingUser(UserModel);

export type RegisterUserFunction = (
    email: string,
    firstName: string,
    lastName: string,
    hashedPassword: string,
) => Promise<RegistrationStatus>;
export const registerUser = makeRegisterUser(
    logger,
    handleExistingUser,
    generateAndPersistRegistrationVerificationToken,
    generateAndPersistExpiredPasswordResetVerificationToken,
    sendMail,
    UserModel,
);

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

export type RegisterUserFunction = (
    email: string,
    firstName: string,
    lastName: string,
    hashedPassword: string,
) => Promise<RegistrationStatus>;
export const registerUser = makeRegisterUser(
    logger,
    sendMail,
    generateRegistrationVerificationToken,
    generatePasswordResetToken,
);

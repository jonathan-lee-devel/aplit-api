import {makeConfirmRegistration} from './confirm-registration';
import {makeGenerateRegistrationVerificationToken}
  from './generate-registration-verification-token';
import {makeRegisterUser} from './register-user';
import {generatePasswordResetToken} from '../password';
import {loggerConfig} from '../../config/Logger';
import {UserModel} from '../../models/User';
import {sendMail} from '../email';

const logger = loggerConfig();

const generateRegistrationVerificationToken =
    makeGenerateRegistrationVerificationToken();

export const confirmRegistration = makeConfirmRegistration(
    UserModel,
);
export const registerUser = makeRegisterUser(
    logger,
    sendMail,
    generateRegistrationVerificationToken,
    generatePasswordResetToken,
);

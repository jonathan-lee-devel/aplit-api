import {makeConfirmRegistration} from './confirm-registration';
import {makeGenerateRegistrationVerificationToken}
  from './generate-registration-verification-token';
import {makeRegisterUser} from './register-user';
import {sendMail} from '../email';
import {generatePasswordResetToken} from '../password';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

const generateRegistrationVerificationToken =
    makeGenerateRegistrationVerificationToken();

export const confirmRegistration = makeConfirmRegistration();
export const registerUser = makeRegisterUser(
    logger,
    sendMail,
    generateRegistrationVerificationToken,
    generatePasswordResetToken,
);

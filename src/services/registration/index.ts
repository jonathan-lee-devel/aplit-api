import {makeConfirmRegistration} from './confirm-registration';
import {makeGenerateRegistrationVerificationToken}
  from './generate-registration-verification-token';
import {makeRegisterUser} from './register-user';
import {generatePasswordResetToken} from '../password';
import {loggerConfig} from '../../config/Logger';
import {mailerConfig} from '../../config/Mail';
import {UserModel} from '../../models/User';

const logger = loggerConfig();
const mailer = mailerConfig();

const generateRegistrationVerificationToken =
    makeGenerateRegistrationVerificationToken();

export const confirmRegistration = makeConfirmRegistration(
    UserModel,
);
export const registerUser = makeRegisterUser(
    logger,
    mailer,
    generateRegistrationVerificationToken,
    generatePasswordResetToken,
);

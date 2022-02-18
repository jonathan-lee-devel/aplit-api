import express from 'express';
import {configureRegisterRoute} from './register';
import {configureLoginRoute} from './login-route';
import {configureLogoutRoute} from './logout-route';
import {configureConfirmPasswordResetRoute}
  from './confirm-password-reset-route';
import {configureResetPasswordReset} from './reset-password-route';
import {configureProfileRoute} from './profile-route';
import {configureUpdateProfileRoute} from './update-profile-route';
import {configureConfirmRegistrationRoute} from './confirm-registration-route';
import {confirmRegistration, registerUser} from '../../services/registration';
import {confirmPasswordReset, encodePassword, resetPassword}
  from '../../services/password';
import {getUserProfile, updateUserProfile} from '../../services/user-profile';
import {makeFormatRegistrationResponse}
  from './helpers/format-registration-response';
import {makeFormatPasswordResetResponse}
  from './helpers/format-password-reset-response';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();
// eslint-disable-next-line new-cap
const router = express.Router();

const formatRegistrationResponse = makeFormatRegistrationResponse();

const formatPasswordResetResponse = makeFormatPasswordResetResponse();

configureConfirmRegistrationRoute(
    logger,
    router,
    confirmRegistration,
    formatRegistrationResponse,
);
configureLoginRoute(logger, router);
configureRegisterRoute(
    logger,
    router,
    encodePassword,
    registerUser,
    formatRegistrationResponse,
);
configureConfirmPasswordResetRoute(
    logger,
    router,
    confirmPasswordReset,
    formatPasswordResetResponse,
);
configureConfirmRegistrationRoute(
    logger,
    router,
    confirmRegistration,
    formatRegistrationResponse,
);
configureResetPasswordReset(
    logger,
    router,
    resetPassword,
    formatPasswordResetResponse,
);
configureLoginRoute(logger, router);
configureLogoutRoute(logger, router);
configureProfileRoute(logger, router, getUserProfile);
configureUpdateProfileRoute(logger, router, updateUserProfile);

export {router as UsersRouter};

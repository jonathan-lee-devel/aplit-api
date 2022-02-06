import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {registerRoute} from './register';
import {confirmRegistrationRoute} from './confirm-registration';
import {loginRoute} from './login';
import {logoutRoute} from './logout';
import {loggerConfig} from '../../config/Logger';
import {transporter} from '../../config/Mail';
import {passwordResetConfirmRoute} from './password-reset-confirm';
import {passwordResetRoute} from './password-reset';
import {profileRoute} from './profile-route';
import {profileUpdateRoute} from './profile-update-route';

const logger = loggerConfig();

dotenv.config();

// eslint-disable-next-line new-cap
const router = express.Router();

bcrypt.genSalt((err, salt) => {
  if (err) throw err;
  registerRoute(logger, router, salt, transporter);
  passwordResetConfirmRoute(logger, router, salt);
});
confirmRegistrationRoute(logger, router);
passwordResetRoute(logger, router, transporter);
loginRoute(logger, router);
logoutRoute(logger, router);
profileRoute(logger, router);
profileUpdateRoute(logger, router);

export {router as UsersRouter};

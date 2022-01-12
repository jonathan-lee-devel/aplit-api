import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {registerRoute} from './register';
import {confirmRegistrationRoute} from './confirm-registration';
import {loginRoute} from './login';
import {logoutRoute} from './logout';
import {transporter} from '../../config/Mail';
import {passwordResetConfirmRoute} from './password-reset-confirm';
import {passwordResetRoute} from './password-reset';

dotenv.config();

// eslint-disable-next-line new-cap
const router = express.Router();

bcrypt.genSalt((err, salt) => {
  if (err) throw err;
  registerRoute(router, salt, transporter);
  passwordResetConfirmRoute(router, salt);
});
confirmRegistrationRoute(router);
passwordResetRoute(router, transporter);
loginRoute(router);
logoutRoute(router);

export {router as UsersRouter};

import {Router} from 'express';
import {body} from 'express-validator';
import {confirmPasswordReset} from '../../services/password-reset/confirm';
import {PasswordResetStatus} from '../../services/password-reset/enum/status';
import {formatPasswordResetResponse} from './helpers/password-reset-format';

export const passwordResetConfirmRoute = (router: Router, salt: string) => {
  router.post('/password/reset/confirm',
      body('token').exists(),
      body('password', 'Passwords must match')
          .exists()
          .custom((input, {req}) => {
            return input === req.body.confirm_password;
          }),
      body('confirm_password', 'Passwords must match')
          .exists()
          .custom((input, {req}) => {
            return input === req.body.password;
          }),
      async (req, res, _) => {
        const {token, password} = req.body;

        const passwordResetStatus =
          await confirmPasswordReset(token, salt, password);

        switch (passwordResetStatus) {
          case PasswordResetStatus.SUCCESS:
            return formatPasswordResetResponse(res, 200, passwordResetStatus);
          case PasswordResetStatus.INVALID_TOKEN:
          case PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED:
            return formatPasswordResetResponse(res, 400, passwordResetStatus);
          default:
            return formatPasswordResetResponse(res, 500, passwordResetStatus);
        }
      });
};

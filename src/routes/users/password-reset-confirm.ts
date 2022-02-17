import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import npmlog from 'npmlog';
import {
  passwordResetConfirm,
} from '../../services/password/confirm-password-reset';
import {
  PasswordResetStatus,
} from '../../services/password/enum/password-reset-status';
import {formatPasswordResetResponse} from './helpers/password-reset-format';
import {getLoggingPrefix} from '../../config/Logger';

export const passwordResetConfirmRoute = (
    logger: npmlog.Logger, router: Router, salt: string,
) => {
  router.post('/password/reset/confirm',
      body('token').exists(),
      body('password', 'Passwords must match and be at least 8 characters long')
          .exists()
          .isLength({min: 8})
          .custom((input, {req}) => {
            return input === req.body.confirm_password;
          }),
      body('confirm_password',
          'Passwords must match and be at least 8 characters long')
          .exists()
          .isLength({min: 8})
          .custom((input, {req}) => {
            return input === req.body.password;
          }),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(
              getLoggingPrefix(), 'Bad request: %j', errors.array(),
          );
          return res.status(400).json({errors: errors.array()});
        }

        const {token, password} = req.body;

        const passwordResetStatus =
          await passwordResetConfirm(token, salt, password);

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

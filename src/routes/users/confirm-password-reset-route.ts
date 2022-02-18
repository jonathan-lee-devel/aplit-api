import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {Response} from 'express-serve-static-core';
import {
  PasswordResetStatus,
} from '../../services/password/enum/password-reset-status';
import {Logger} from '../../generic/Logger';

export const configureConfirmPasswordResetRoute = (
    logger: Logger,
    router: Router,
    confirmPasswordReset: {
        (token: string,
         password: string)
            : Promise<PasswordResetStatus>;
        },
    formatPasswordResetResponse: {
        (res: Response,
         httpStatus: number,
         passwordResetStatus: PasswordResetStatus)
            : void;
        },
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
              `Bad request: ${JSON.stringify(errors.array())}`,
          );
          return res.status(400).json({errors: errors.array()});
        }

        const {token, password} = req.body;

        const passwordResetStatus =
          await confirmPasswordReset(token, password);

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

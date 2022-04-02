import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {
  PasswordResetStatus,
} from '../../services/password/enum/password-reset-status';
import {Logger} from '../../generic/Logger';
import {ConfirmPasswordResetFunction} from '../../services/password';
import {FormatPasswordResetResponseFunction} from './index';

/**
 * Configure POST confirm password reset route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {ConfirmPasswordResetFunction} confirmPasswordReset
 * @param {FormatPasswordResetResponseFunction} formatPasswordResetResponse
 */
export const configurePostConfirmPasswordResetRoute = (
    logger: Logger,
    router: Router,
    confirmPasswordReset: ConfirmPasswordResetFunction,
    formatPasswordResetResponse: FormatPasswordResetResponseFunction,
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

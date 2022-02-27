import {Router} from 'express';
import {Response} from 'express-serve-static-core';
import {query, validationResult} from 'express-validator';
import {Logger} from '../../generic/Logger';
import {PasswordResetStatus}
  from '../../services/password/enum/password-reset-status';

/**
 * Configure POST reset password.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {Function} resetPassword used to reset password
 * @param {Function} formatPasswordResetResponse used to format response
 */
export const configurePostResetPassword = (
    logger: Logger,
    router: Router,
    resetPassword: {
        (email: string)
            : Promise<PasswordResetStatus>;
        },
    formatPasswordResetResponse: {
        (res: Response,
         httpStatus: number,
         passwordResetStatus: PasswordResetStatus)
            : void;
        },
) => {
  router.post('/password/reset',
      query('email', 'Only valid e-mail addresses are allowed')
          .exists()
          .isEmail(),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const {email} = req.query;

        const passwordResetStatus = await resetPassword(email);

        return formatPasswordResetResponse(res, 200, passwordResetStatus);
      },
  );
};

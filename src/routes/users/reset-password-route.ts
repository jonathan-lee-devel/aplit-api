import {Router} from 'express';
import {Response} from 'express-serve-static-core';
import {query, validationResult} from 'express-validator';
import {Logger} from '../../generic/Logger';
import {PasswordResetStatus}
  from '../../services/password/enum/password-reset-status';

export const configureResetPasswordReset = (
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

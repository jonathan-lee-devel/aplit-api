import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import {resetPassword} from '../../services/password-reset/reset';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {formatPasswordResetResponse} from './helpers/password-reset-format';

export const passwordResetRoute = (
    router: Router,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
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

        const passwordResetStatus = await resetPassword(transporter, email);

        return formatPasswordResetResponse(res, 200, passwordResetStatus);
      },
  );
};

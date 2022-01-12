import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {formatRegistrationResponse} from './helpers/registration-format';
import {RegistrationStatus} from '../../services/registration/enum/status';
import {registerUser} from '../../services/registration/register';
import {encodePassword} from '../../services/password/encode';

export const registerRoute = (
    router: Router,
    salt: string,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
) => {
  router.post(
      '/register',
      body('email', 'Only valid e-mail addresses are allowed')
          .exists()
          .isEmail(),
      body('firstname', 'A first name must be provided')
          .exists(),
      body('lastname', 'A last name must be provided')
          .exists(),
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const {email, firstname, lastname, password} = req.body;

        const hashedPassword = await encodePassword(salt, password);

        const registrationStatus = await registerUser(
            transporter,
            email,
            firstname,
            lastname,
            hashedPassword,
        );

        switch (registrationStatus) {
          case RegistrationStatus.AWAITING_EMAIL_VERIFICATION:
            return formatRegistrationResponse(res, 200, registrationStatus);
          case RegistrationStatus.USER_ALREADY_EXISTS:
            return formatRegistrationResponse(res, 409, registrationStatus);
          default:
            return formatRegistrationResponse(res, 500, registrationStatus);
        }
      },
  );
};

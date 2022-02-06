import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import npmlog from 'npmlog';
import {formatRegistrationResponse} from './helpers/registration-format';
import {
  RegistrationStatus,
} from '../../services/registration/enum/registration-status';
import {
  registrationConfirm,
} from '../../services/registration/registration-confirm';
import {getLoggingPrefix} from '../../config/Logger';

export const confirmRegistrationRoute = (
    logger: npmlog.Logger, router: Router
) => {
  router.get('/register/confirm', query('token').exists(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
          getLoggingPrefix(), 'Bad request: %j', errors.array(),
      );
      return res.status(400).json({errors: errors.array()});
    }
    const {token} = req.query;
    if (!token) {
      // Strange behaviour with express-validator for query parameter
      logger.info(
          getLoggingPrefix(),
          'Bad request: missing required query parameter \'token\'',
      );
      return res.status(400).json({
        errors: [
          {
            value: token,
            msg: 'Query parameter \'token\' is required',
            param: 'token',
            location: 'query',
          },
        ],
      });
    }

    const registrationStatus = await registrationConfirm(token);

    switch (registrationStatus) {
      case RegistrationStatus.SUCCESS:
        return res.redirect(`${process.env.FRONT_END_URL}/login`);
      case RegistrationStatus.INVALID_TOKEN:
      case RegistrationStatus.EMAIL_VERIFICATION_EXPIRED:
        return formatRegistrationResponse(res, 400, registrationStatus);
      default:
        return formatRegistrationResponse(res, 500, registrationStatus);
    }
  });
};

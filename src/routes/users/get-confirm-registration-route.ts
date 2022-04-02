import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import {
  RegistrationStatus,
} from '../../services/registration/enum/registration-status';
import {Logger} from '../../generic/Logger';
import {Response} from 'express-serve-static-core';

/**
 * Configure GET confirm registration route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {Function} confirmRegistration used to confirm registration
 * @param {Function} formatRegistrationResponse used to format response
 */
export const configureGetConfirmRegistrationRoute = (
    logger: Logger,
    router: Router,
    confirmRegistration: {
      (token: string)
          : Promise<RegistrationStatus>;
      },
    formatRegistrationResponse: {
      (res: Response,
       httpStatus: number,
       registrationStatus: RegistrationStatus)
          : void;
      },
) => {
  router.get('/register/confirm', query('token').exists(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
          `Bad request: ${JSON.stringify(errors.array())}`,
      );
      return res.status(400).json({errors: errors.array()});
    }
    const {token} = req.query;
    if (!token) {
      // Strange behaviour with express-validator for query parameter
      logger.info(
          `Bad request: missing required query parameter 'token'`,
      );
      return res.status(400).json({
        errors: [
          {
            value: token,
            msg: `Query parameter 'token' is required`,
            param: 'token',
            location: 'query',
          },
        ],
      });
    }

    const registrationStatus = await confirmRegistration(token);

    switch (registrationStatus) {
      case RegistrationStatus.SUCCESS:
      case RegistrationStatus.INVALID_TOKEN:
      case RegistrationStatus.EMAIL_VERIFICATION_EXPIRED:
        return formatRegistrationResponse(res, 200, registrationStatus);
      default:
        return formatRegistrationResponse(res, 500, registrationStatus);
    }
  });
};

import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {Logger} from '../../generic/Logger';
import {VerifyEmailFunction} from '../../services/email';
import {CreatePropertyFunction} from '../../services/properties';

/**
 * Configure POST property route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {VerifyEmailFunction} verifyEmail used to verify e-mail address input
 * @param {Function} createProperty used to create property
 */
export const configurePostPropertyRoute = (
    logger: Logger,
    router: Router,
    verifyEmail: VerifyEmailFunction,
    createProperty: CreatePropertyFunction,
) => {
  router.post('/create',
      body('title', 'Title must be of length 5-25 characters')
          .exists()
          .isLength({min: 5, max: 25}),
      body('tenants', 'Only valid e-mail addresses are allowed')
          .exists()
          .custom((input) => {
            for (const email of input.toString().split(',')) {
              if (!verifyEmail(email)) {
                return false;
              }
            }
            return true;
          }),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {title, tenants} = req.body;

        const propertyContainer = await createProperty(
            title,
            tenants,
            // @ts-ignore
            req.user,
            // @ts-ignore
            req.user,
        );

        if (propertyContainer.status === 201) {
          return res
              .status(propertyContainer.status)
              .json(propertyContainer.data);
        }
        logger.error(
            'Error has occurred while creating property',
        );
        return res.status(500).json({message: 'An error has occurred'});
      },
  );
};

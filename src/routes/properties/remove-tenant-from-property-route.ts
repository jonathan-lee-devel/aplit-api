import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {RemoveTenantFromPropertyFunction} from '../../services/properties';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {VerifyEmailFunction} from '../../services/email';

export const configureRemoveTenantFromPropertyRoute = (
    logger: Logger,
    router: Router,
    verifyEmail: VerifyEmailFunction,
    removeTenantFromProperty: RemoveTenantFromPropertyFunction,
) => {
  router.patch('/remove-tenant',
      body('propertyId', 'Must be a valid property ID')
          .exists(),
      body('tenantEmailToRemove', 'Must be a valid e-mail address')
          .exists()
          .custom((input) => {
            return verifyEmail(input.toString());
          }),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {propertyId, tenantEmailToRemove} = req.body;

        const propertyContainer = await removeTenantFromProperty(
            // @ts-ignore
            req.user,
            propertyId,
            tenantEmailToRemove,
        );

        if (propertyContainer.status === 204) {
          return res
              .status(propertyContainer.status)
              .json(propertyContainer.data);
        }
        if (propertyContainer.status === 400) {
          return res
              .status(propertyContainer.status)
              .json({error: 'Failed to find tenant or property'});
        }
        logger.error(
            'Error has occurred while removing tenant from property',
        );
        return res.status(500).json({message: 'An error has occurred'});
      },
  );
};

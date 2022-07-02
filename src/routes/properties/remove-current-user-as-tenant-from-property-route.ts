import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {
  RemoveCurrentUserAsTenantFromPropertyFunction,
} from '../../services/properties';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';

export const configureRemoveCurrentUserAsTenantTenantFromPropertyRoute = (
    logger: Logger,
    router: Router,
    removeCurrentUserAsTenantFromProperty:
        RemoveCurrentUserAsTenantFromPropertyFunction,
) => {
  router.patch('/tenant-leave',
      body('propertyId', 'Must be a valid property ID')
          .exists(),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {propertyId} = req.body;

        const propertyContainer = await removeCurrentUserAsTenantFromProperty(
            // @ts-ignore
            req.user,
            propertyId,
        );

        switch (propertyContainer.status) {
          case 204:
            return res
                .status(propertyContainer.status)
                .json(propertyContainer.data);
          case 400:
            return res
                .status(propertyContainer.status)
                .json({error: 'Failed to find tenant or property'});
          case 403:
            return res
                .status(propertyContainer.status)
                .json({error: 'Permission denied'});
        }
        logger.error(
            'Error has occurred while removing tenant from property',
        );
        return res.status(500).json({message: 'An error has occurred'});
      },
  );
};

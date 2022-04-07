import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {getPropertiesForUserAsAdmin} from '../../services/properties';
import {Logger} from '../../generic/Logger';

/**
 * Configure GET property route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 */
export const configureGetPropertiesForUserAsAdminRoute = (
    logger: Logger,
    router: Router,
) => {
  router.get('/my/admin', isLoggedIn, async (req, res, _) => {
    try {
      // @ts-ignore
      const propertiesContainer = await getPropertiesForUserAsAdmin(req.user);
      if (propertiesContainer.status === 200) {
        return res
            .status(propertiesContainer.status)
            .json(propertiesContainer.data);
      } else {
        logger.error(
            `Unrecognized status: ${propertiesContainer.status}`);
        return res
            .status(500)
            .json({error: 'An undefined error has occurred'});
      }
    } catch (err) {
      logger.error(`Error has occurred: ${err.message}`);
      return res.status(500).json({error: 'An error has occurred'});
    }
  });
};

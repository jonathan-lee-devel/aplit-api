import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {GetPropertyIsAdminFunction} from '../../services/properties';
import {Logger} from '../../generic/Logger';

/**
 * Configure GET property route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {GetPropertyIsAdminFunction} getPropertyIsAdmin
 */
export const configureGetPropertyIsAdminRoute = (
    logger: Logger,
    router: Router,
    getPropertyIsAdmin: GetPropertyIsAdminFunction,
) => {
  router.get('/:id/isAdmin', isLoggedIn, async (req, res, _) => {
    try {
      return res
          .status(200)
          // @ts-ignore
          .json(await getPropertyIsAdmin(req.user, req.params.id));
    } catch (err) {
      logger.error(`Error has occurred: ${err.message}`);
      return res.status(500).json({error: 'An error has occurred'});
    }
  });
};

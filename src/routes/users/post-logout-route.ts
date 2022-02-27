import {Router} from 'express';
import {Logger} from '../../generic/Logger';

/**
 * Configure POST logout route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 */
export const configurePostLogoutRoute = (
    logger: Logger,
    router: Router,
) => {
  router.post('/logout', (req, res, _) => {
    req.logout();
    res.json({logout_status: 'SUCCESS'});
  });
};

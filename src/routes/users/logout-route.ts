import {Router} from 'express';
import {Logger} from '../../generic/Logger';

export const configureLogoutRoute = (
    logger: Logger,
    router: Router,
) => {
  router.post('/logout', (req, res, _) => {
    req.logout();
    res.json({logout_status: 'SUCCESS'});
  });
};

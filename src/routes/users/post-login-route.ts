import {Router} from 'express';
import passport from 'passport';
import {Logger} from '../../generic/Logger';

/**
 * Configure POST login route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 */
export const configurePostLoginRoute = (
    logger: Logger,
    router: Router,
) => {
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, _) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({login_status: 'FAILURE'});
      }

      req.login(user, (loginError) => {
        if (loginError) {
          return next(loginError);
        }
        return res.status(200).json({login_status: 'SUCCESS'});
      });
    })(req, res, next);
  });
};

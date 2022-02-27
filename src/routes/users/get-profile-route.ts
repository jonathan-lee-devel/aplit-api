import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {UserProfileDto} from '../../dto/UserProfileDto';
import {Logger} from '../../generic/Logger';

/**
 * Configure GET profile route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {Function} getUserProfile used to get user profile
 */
export const configureGetProfileRoute = (
    logger: Logger,
    router: Router,
    getUserProfile: {
        (email: string)
            : Promise<UserProfileDto>;
        },
) => {
  router.get('/profile', isLoggedIn,
      query('email', 'Only valid e-mail addresses are allowed')
          .exists()
          .isEmail(),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(
              `Bad request: ${JSON.stringify(errors.array())}`,
          );
          return res.status(400).json({errors: errors.array()});
        }

        const {email} = req.query;

        const profile = await getUserProfile(email);

        return res.status(200).json(profile);
      },
  );
};

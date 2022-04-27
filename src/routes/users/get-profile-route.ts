import {Router} from 'express';
import {validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {UserProfileDto} from '../../data/dto/UserProfileDto';
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
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(
              `Bad request: ${JSON.stringify(errors.array())}`,
          );
          return res.status(400).json({errors: errors.array()});
        }

        // @ts-ignore
        const {email} = req.user.email;

        const profile = await getUserProfile(email);

        return res.status(200).json(profile);
      },
  );
};

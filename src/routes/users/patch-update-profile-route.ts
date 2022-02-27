import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {UserProfileDto} from '../../dto/UserProfileDto';
import {isLoggedIn} from '../../config/Auth';
import {Logger} from '../../generic/Logger';

/**
 * Configure PATCH update profile route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 * @param {Function} updateUserProfile used to update user profile
 */
export const configurePatchUpdateProfileRoute = (
    logger: Logger,
    router: Router,
    updateUserProfile: {
        (profile: UserProfileDto)
            : Promise<UserProfileDto>;
        },
) => {
  router.patch('/profile', isLoggedIn,
      body('email',
          'Only the logged in user can edit their user-profile')
          .custom((input, meta) => {
            const {req} = meta;
            return req.body.email === req.user.email;
          }),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(
              `Bad request: ${JSON.stringify(errors.array())}`,
          );
          return res.status(400).json({errors: errors.array()});
        }

        const updatedProfile = await updateUserProfile(req.body);

        return res.status(200).json(updatedProfile);
      });
};

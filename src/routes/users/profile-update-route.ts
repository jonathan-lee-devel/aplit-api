import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {body, validationResult} from 'express-validator';
import npmlog from 'npmlog';
import {userProfileUpdate} from '../../services/user-profile/profile-update';
import {getLoggingPrefix} from '../../config/Logger';

export const profileUpdateRoute = (
    logger: npmlog.Logger, router: Router,
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
              getLoggingPrefix(), 'Bad request: %j', errors.array(),
          );
          return res.status(400).json({errors: errors.array()});
        }

        const updatedProfile = await userProfileUpdate(req.body);

        return res.status(200).json(updatedProfile);
      });
};

import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {body, validationResult} from 'express-validator';
import {userProfileUpdate} from '../../services/user-profile/profile-update';

export const profileUpdateRoute = (
    router: Router,
) => {
  router.patch('/user-profile', isLoggedIn,
      body('email',
          'Only the logged in user can edit their user-profile')
          .custom((input, meta) => {
            const {req} = meta;
            return req.body.email === req.user.email;
          }),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const updatedProfile = await userProfileUpdate(req.body);

        return res.status(200).json(updatedProfile);
      });
};

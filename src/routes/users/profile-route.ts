import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import {userProfileGet} from '../../services/user-profile/profile';
import {isLoggedIn} from '../../config/Auth';

export const profileRoute = (
    router: Router,
) => {
  router.get('/profile', isLoggedIn,
      query('email', 'Only valid e-mail addresses are allowed')
          .exists()
          .isEmail(),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const {email} = req.query;

        const profile = await userProfileGet(email);

        return res.status(200).json(profile);
      },
  );
};

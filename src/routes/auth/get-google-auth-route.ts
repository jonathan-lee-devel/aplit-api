import {Router} from 'express';
import passport from 'passport';

export const configureGetGoogleAuthRoute = (
    router: Router,
) => {
  router.get('/google',
      passport.authenticate('google', {scope: ['profile', 'email']}));
};

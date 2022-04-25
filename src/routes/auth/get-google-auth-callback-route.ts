import {Router} from 'express';
import passport from 'passport';

export const configureGetGoogleAuthCallbackRoute = (
    router: Router,
) => {
  router.get('/google/callback',
      passport.authenticate('google', {failureRedirect: '/login'}),
      (req, res) => {
      console.log('Success');
        res.redirect(`${process.env.FRONT_END_URL}/home`);
      });
};

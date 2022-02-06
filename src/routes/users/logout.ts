import {Router} from 'express';
import dotenv from 'dotenv';
import npmlog from 'npmlog';

dotenv.config();

export const logoutRoute = (logger: npmlog.Logger, router: Router) => {
  router.post('/logout', (req, res, _) => {
    req.logout();
    res.json({logout_status: 'SUCCESS'});
  });
};

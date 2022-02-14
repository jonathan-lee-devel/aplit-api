import {NextFunction, Request, Response} from 'express-serve-static-core';
import {loggerConfig, getLoggingPrefix} from './Logger';

const logger = loggerConfig();

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
      .status(401)
      .json({message: 'You must be logged in to view this resource'});
};

export const logAuthError = (
    req: Request, res: Response, next: NextFunction,
) => {
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      let username = undefined;
      if (req.body.email) {
        username = req.body.email;
      } else if (req.user) {
        // @ts-ignore
        username = req.user.email;
      } else if (req.body.username) {
        username = req.body.username;
      }
      logger.info(
          getLoggingPrefix(),
          'Authentication/Authorization error (%s)' +
                ' at %s%s from %s {"username":"%s"}',
          res.statusCode, req.baseUrl, req.url,
          req.ip, username,
      );
    }
  });

  return next();
};

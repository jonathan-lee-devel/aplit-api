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
      logger.info(
          getLoggingPrefix(),
          'Authentication/Authorization error (%s)' +
          ' at %s from %s {"username":"%s"}',
          res.statusCode, req.url, req.ip, req.body.username,
      );
    }
  });

  return next();
};

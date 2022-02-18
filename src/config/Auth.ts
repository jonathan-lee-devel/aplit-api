import {NextFunction, Request, Response} from 'express-serve-static-core';
import {loggerConfig} from './Logger';

const logger = loggerConfig();

/**
 * Used as a guard to prevent unauthenticated users
 * from accessing specified routes.
 *
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 * @return {NextFunction} call to next function
 */
export const isLoggedIn = (
    req: Request, res: Response, next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
      .status(401)
      .json({message: 'You must be logged in to view this resource'});
};

export const interceptAndLogAuthError = (
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
          // eslint-disable-next-line max-len
          `Authentication/Authorization error (${req.statusCode}) at ${req.baseUrl}${req.url} from ${req.ip} {"username":"${username}"}`,
      );
    }
  });

  return next();
};

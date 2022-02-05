import {NextFunction, Request, Response} from 'express-serve-static-core';
import csrf from 'csurf';

export const csrfConfig = () => {
  return csrf({
    cookie: {httpOnly: true},
    ignoreMethods: ['GET'],
  });
};

export const csrfSetCookie = (
    req: Request, res: Response, next: NextFunction,
) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
};

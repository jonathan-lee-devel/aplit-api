import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import {connect} from 'mongoose';
import expressSession from 'express-session';
import passport from 'passport';

import {passportConfig} from './config/Passport';
import {UsersRouter} from './routes/users/routes';
import {PropertiesRouter} from './routes/properties/routes';

dotenv.config();

const app = express();
app.use(
    expressSession({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet.hidePoweredBy());
app.use(logger('dev'));
app.use(
    cors({
      credentials: true,
      origin: process.env.FRONT_END_URL,
    }),
);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// TODO re-enable CSRF
// app.use(
//     csrf({
//       cookie: {httpOnly: true},
//       ignoreMethods: ['GET'],
//     }),
// );
// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

connect(process.env.DATABASE_URL)
    .then((_) => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.error(err);
    });

app.use('/users', UsersRouter);
app.use('/properties', PropertiesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(
    (
        err: { message: any; status: any },
        req: { app: { get: (arg0: string) => string } },
        res: {
      locals: { message: any; error: any };
      status: (arg0: any) => void;
      json: (arg0: { error: any }) => void;
    },
        _: any,
    ) => {
    // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.json({error: err});
    },
);

export {app};

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import {passportConfig} from './config/Passport';
import {loggerConfig, getLoggingPrefix} from './config/Logger';
import {logAuthError} from './config/Auth';
import {databaseConfig} from './config/Database';
import {expressSessionConfig} from './config/Session';
import {corsConfig} from './config/Cors';
import {UsersRouter} from './routes/users/routes';
import {PropertiesRouter} from './routes/properties/property-routes';

dotenv.config();
const logger = loggerConfig();

const app = express();
databaseConfig(logger);
app.use(expressSessionConfig());
const passport = passportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet.hidePoweredBy());
app.use(corsConfig());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// TODO re-enable CSRF
app.use(logAuthError);

app.use('/users', UsersRouter);
app.use('/properties', PropertiesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(
    (
        err: { message: string; status: string },
        req: any,
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

      logger.error(
          getLoggingPrefix(),
          'Error at %j: {"status":"%s", "message":"%s"}',
          req.url, err.status, err.message);
      res.status(err.status || 500);
      res.json({error: err});
    },
);

export {app};

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {passportConfig} from './config/Passport';
import {interceptAndLogAuthError} from './config/Auth';
import {databaseConfig} from './config/Database';
import {expressSessionConfig} from './config/Session';
import {corsConfig} from './config/Cors';
import {UsersRouter} from './routes/users';
import {PropertiesRouter} from './routes/properties';
import {loggerConfig} from './config/Logger';
import {ExpensesRouter} from './routes/expenses';
import {UserNotificationsRouter} from './routes/notifications';

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
app.use(interceptAndLogAuthError);

app.use('/api/users', UsersRouter);
app.use('/api/properties', PropertiesRouter);
app.use('/api/expenses', ExpensesRouter);
app.use('/api/user-notifications', UserNotificationsRouter);

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
          // eslint-disable-next-line max-len
          `Error at ${req.url}: {"status":"${err.status}", "message":"${err.message}"}`,
      );
      res.status(err.status || 500);
      res.json({error: err});
    },
);

export {app};

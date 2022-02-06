import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import {passportConfig} from './config/Passport';
import {loggerConfig} from './config/Logger';
import {logAuthError} from './config/Auth';
import {databaseConfig} from './config/Database';
import {expressSessionConfig} from './config/Session';
import {corsConfig} from './config/Cors';
import {UsersRouter} from './routes/users/routes';
import {PropertiesRouter} from './routes/properties/routes';

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

export {app};

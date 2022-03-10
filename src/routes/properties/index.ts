import express from 'express';
import {configureGetPropertyRoute} from './get-property-route';
import {configurePostPropertyRoute} from './post-property-route';
import {verifyEmail} from '../../services/email';
import {createProperty} from '../../services/properties';
import {loggerConfig} from '../../config/Logger';
import {mailerConfig} from '../../config/Mail';

const logger = loggerConfig();
const mailer = mailerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

configureGetPropertyRoute(logger, router);
configurePostPropertyRoute(
    logger,
    router,
    verifyEmail,
    mailer,
    createProperty,
);

export {router as PropertiesRouter};

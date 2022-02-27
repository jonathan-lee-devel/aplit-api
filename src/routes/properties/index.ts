import express from 'express';
import {configureGetPropertyRoute} from './get-property-route';
import {configurePostPropertyRoute} from './post-property-route';
import {sendMail, verifyEmail} from '../../services/email';
import {createProperty} from '../../services/properties';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

configureGetPropertyRoute(logger, router);
configurePostPropertyRoute(
    logger,
    router,
    verifyEmail,
    sendMail,
    createProperty,
);

export {router as PropertiesRouter};

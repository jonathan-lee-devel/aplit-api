import express from 'express';
import {makeGetPropertyRoute} from './get-property-route';
import {makePostPropertyRoute} from './post-property-route';
import {sendMail, verifyEmail} from '../../services/email';
import {createProperty} from '../../services/properties';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

makeGetPropertyRoute(logger, router);
makePostPropertyRoute(logger, router, verifyEmail, sendMail, createProperty);

export {router as PropertiesRouter};

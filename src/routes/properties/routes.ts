import express from 'express';
import dotenv from 'dotenv';
import {propertyRoute} from './property-route';
import {propertyCreateRoute} from './property-create-route';
import {transporter} from '../../config/Mail';
import {loggerConfig} from '../../config/Logger';
const logger = loggerConfig();

dotenv.config();

// eslint-disable-next-line new-cap
const router = express.Router();

propertyRoute(logger, router);
propertyCreateRoute(logger, router, transporter);

export {router as PropertiesRouter};

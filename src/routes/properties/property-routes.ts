import express from 'express';
import dotenv from 'dotenv';
import {getPropertyRoute} from './get-property-route';
import {postPropertyRoute} from './post-property-route';
import {transporter} from '../../config/Mail';
import {loggerConfig} from '../../config/Logger';
const logger = loggerConfig();

dotenv.config();

// eslint-disable-next-line new-cap
const router = express.Router();

getPropertyRoute(logger, router);
postPropertyRoute(logger, router, transporter);

export {router as PropertiesRouter};

import express from 'express';
import {getPropertyRoute} from './get-property-route';
import {postPropertyRoute} from './post-property-route';
import {transporterConfig} from '../../config/Mail';
import {loggerConfig} from '../../config/Logger';

const logger = loggerConfig();
const transporter = transporterConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

getPropertyRoute(logger, router);
postPropertyRoute(logger, router, transporter);

export {router as PropertiesRouter};

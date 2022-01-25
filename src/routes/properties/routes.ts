import express from 'express';
import dotenv from 'dotenv';
import {propertyCreateRoute} from './property-create-route';
import {transporter} from '../../config/Mail';

dotenv.config();

// eslint-disable-next-line new-cap
const router = express.Router();

propertyCreateRoute(router, transporter);

export {router as PropertiesRouter};

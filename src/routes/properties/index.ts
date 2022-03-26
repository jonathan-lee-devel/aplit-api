import express from 'express';
import {configureGetPropertyRoute} from './get-property-route';
import {configurePostPropertyRoute} from './post-property-route';
import {verifyEmail} from '../../services/email';
import {
  confirmPropertyInvitation,
  createProperty,
  getPropertyIdFromInvitationToken,
} from
  '../../services/properties';
import {loggerConfig} from '../../config/Logger';
import {mailerConfig} from '../../config/Mail';
import {configureGetConfirmPropertyInvitationRoute} from
  './invitation/get-confirm-property-invitation-route';
import {makeFormatPropertyInvitationResponse} from
  './invitation/helpers/format-property-invitation-response';
import {Response} from 'express-serve-static-core';
import {PropertyInvitationStatus} from
  '../../services/properties/enum/invitation/property-invitation-status';

const logger = loggerConfig();
const mailer = mailerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

export type FormatPropertyInvitationResponseFunction = (
    res: Response,
    httpStatus: number,
    propertyInvitationStatus: PropertyInvitationStatus,
) => void;
const formatPropertyInvitationResponse = makeFormatPropertyInvitationResponse();

configureGetPropertyRoute(logger, router);
configurePostPropertyRoute(
    logger,
    router,
    verifyEmail,
    mailer,
    createProperty,
);
configureGetConfirmPropertyInvitationRoute(
    logger,
    router,
    confirmPropertyInvitation,
    getPropertyIdFromInvitationToken,
    formatPropertyInvitationResponse,
);

export {router as PropertiesRouter};

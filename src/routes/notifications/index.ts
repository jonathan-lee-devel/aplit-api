import express from 'express';
import {loggerConfig} from '../../config/Logger';
import {configurePostUserNotificationRoute} from './post-notification-route';
import {obtainUserFromEmail, verifyEmail} from '../../services/email';
import {createNotification} from '../../services/notifications';

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

configurePostUserNotificationRoute(
    logger,
    router,
    verifyEmail,
    obtainUserFromEmail,
    createNotification,
);

export {router as UserNotificationsRouter};

import {User} from '../../models/User';
import {StatusDataContainer} from '../../data/StatusDataContainer';
import {UserNotificationDto} from
  '../../data/dto/notifications/UserNotificationDto';
import {makeCreateNotification} from './create-notification';
import {generateId} from '../id';
import {loggerConfig} from '../../config/Logger';
import {UserNotificationModel} from
  '../../models/notifications/UserNotification';

const logger = loggerConfig();

export type CreateNotificationFunction = (
    user: User,
    subject: string,
    content: string,
) => Promise<StatusDataContainer<UserNotificationDto>>;
export const createNotification = makeCreateNotification(
    logger,
    generateId,
    UserNotificationModel,
);

import {Logger} from '../../generic/Logger';
import {GenerateIdFunction} from '../id';
import {Model} from 'mongoose';
import {UserNotification} from '../../models/notifications/UserNotification';
import {User} from '../../models/User';
import {StatusDataContainer} from '../../data/StatusDataContainer';
import {CreateNotificationFunction} from './index';
import {UserNotificationDto} from
  '../../data/dto/notifications/UserNotificationDto';

export const makeCreateNotification = (
    logger: Logger,
    generateId: GenerateIdFunction,
    UserNotificationModel: Model<UserNotification>,
): CreateNotificationFunction => {
  return async function createNotification(
      user: User,
      subject: string,
      content: string,
  ): Promise<StatusDataContainer<UserNotificationDto>> {
    const userNotification: UserNotification = {
      id: await generateId(),
      user,
      subject,
      content,
      isRead: false,
      createdAt: new Date(),
    };

    try {
      await new UserNotificationModel(userNotification).save();
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 201,
      data: {
        id: userNotification.id,
        user: userNotification.user.email,
        subject: userNotification.subject,
        content: userNotification.content,
        isRead: userNotification.isRead,
        createdAt: userNotification.createdAt,
      },
    };
  };
};

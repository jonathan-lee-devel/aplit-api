import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {User} from '../User';
import {ObjectID} from 'bson';

/**
 * Used to represent a user notification.
 */
export interface UserNotification {
    id: string;
    user: User;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

const schema = new Schema<UserNotification>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: ObjectID,
    required: true,
    unique: false,
  },
  subject: {
    type: String,
    required: true,
    unique: false,
  },
  content: {
    type: String,
    required: true,
    unique: false,
  },
  isRead: {
    type: Boolean,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: false,
  },
});

export const UserNotificationModel =
    model<UserNotification>('UserNotification', schema);

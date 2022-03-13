import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {ObjectID} from 'bson';
import {User} from '../User';

/**
 * Used to represent a password reset token.
 */
export interface PasswordResetToken {
  value: string;
  expiryDate: Date;
  user: User;
}

const schema = new Schema<PasswordResetToken>({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  expiryDate: {
    type: Date,
    required: true,
    unique: false,
  },
  user: {
    type: ObjectID,
    required: false, // To allow for initialization
    unique: true,
  },
});

export const PasswordResetTokenModel =
  model<PasswordResetToken>('PasswordResetToken', schema);

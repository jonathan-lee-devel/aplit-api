import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {ObjectID} from 'bson';
import {User} from './User';

/**
 * Used to represent a registration verification token.
 */
export interface RegistrationVerificationToken {
  value: string;
  expiryDate: Date;
  user: User;
}

const schema = new Schema<RegistrationVerificationToken>({
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

export const RegistrationVerificationTokenModel =
  model<RegistrationVerificationToken>('RegistrationVerificationToken', schema);

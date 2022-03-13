import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {RegistrationVerificationToken}
  from './registration/RegistrationVerificationToken';
import {ObjectID} from 'bson';
import {PasswordResetToken} from './password/PasswordResetToken';

/**
 * Used to represent a user.
 */
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  emailVerified: boolean;
  registrationVerificationToken: RegistrationVerificationToken;
  passwordResetToken: PasswordResetToken;
}

const schema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    unique: false,
  },
  registrationVerificationToken: {
    type: ObjectID,
    required: true,
    unique: true,
  },
  passwordResetToken: {
    type: ObjectID,
    required: true,
    unique: true,
  },
});

export const UserModel = model<User>('User', schema);

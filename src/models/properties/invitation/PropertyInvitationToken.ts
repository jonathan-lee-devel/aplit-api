import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {ObjectID} from 'bson';
import {Property} from '../Property';

/**
 * Used to represent a property invitation token.
 */
export interface PropertyInvitationToken {
    value: string;
    expiryDate: Date,
    property: Property;
}

const schema = new Schema<PropertyInvitationToken>({
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
  property: {
    type: ObjectID,
    required: true,
    unique: false,
  },
});

export const PropertyInvitationTokenModel =
    model<PropertyInvitationToken>('PropertyInvitationToken', schema);

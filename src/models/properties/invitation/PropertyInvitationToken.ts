import mongoose from 'mongoose';
import {Property} from '../Property';
import {ObjectID} from 'bson';
const {model, Schema} = mongoose;

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

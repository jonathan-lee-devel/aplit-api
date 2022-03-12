import mongoose from 'mongoose';
const {model, Schema} = mongoose;

/**
 * Used to represent an invitation to a property.
 */
export interface PropertyInvitation {
    id: string;
    propertyId: string;
    inviteeEmail: string;
    inviterEmail: string;
    accepted: false;
    expiryDate: Date,
}

const schema = new Schema<PropertyInvitation>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  propertyId: {
    type: String,
    required: true,
    unique: false,
  },
  inviteeEmail: {
    type: String,
    required: true,
    unique: false,
  },
  inviterEmail: {
    type: String,
    required: true,
    unique: false,
  },
  accepted: {
    type: Boolean,
    required: true,
    unique: false,
  },
  expiryDate: {
    type: Date,
    required: true,
    unique: false,
  },
});

export const PropertyInvitationModel =
    model<PropertyInvitation>('PropertyInvitation', schema);

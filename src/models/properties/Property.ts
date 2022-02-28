import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {User} from '../User';
import {ObjectID} from 'bson';

/**
 * Used to represent a single property.
 */
export interface Property {
  id: string;
  title: string;
  tenants: string[];
  createdBy: User;
  admin: User;
}

const schema = new Schema<Property>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  tenants: {
    type: [String],
    required: true,
    unique: false,
  },
  createdBy: {
    type: ObjectID,
    required: true,
    unique: false,
  },
  admin: {
    type: ObjectID,
    required: true,
    unique: false,
  },
});

export const PropertyModel = model<Property>('Property', schema);

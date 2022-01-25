import {model, Schema} from 'mongoose';
import {User} from '../User';
import {ObjectID} from 'bson';


export interface Property {
  title: string;
  tenants: string[];
  user: User;
}

const schema = new Schema<Property>({
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
  user: {
    type: ObjectID,
    required: true,
    unique: false,
  },
});

export const PropertyModel = model<Property>('Property', schema);

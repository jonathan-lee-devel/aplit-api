import mongoose from 'mongoose';
const {model, Schema} = mongoose;
import {Property} from '../properties/Property';
import {ObjectID} from 'bson';
import {User} from '../User';
import {ExpenseFrequency} from '../../services/expenses/enum/expense-frequency';

export interface Expense {
    id: string;
    amount: string;
    frequency: ExpenseFrequency;
    property: Property;
    createdBy: User;
}

const schema = new Schema<Expense>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: String,
    required: true,
    unique: false,
  },
  frequency: {
    type: Number,
    required: true,
    unique: false,
  },
  property: {
    type: ObjectID,
    required: true,
    unique: false,
  },
  createdBy: {
    type: ObjectID,
    required: true,
    unique: false,
  },
});

export const ExpenseModel = model<Expense>('Expense', schema);

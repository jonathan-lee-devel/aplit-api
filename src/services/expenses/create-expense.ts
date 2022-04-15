import {Logger} from '../../generic/Logger';
import {GenerateIdFunction} from '../id';
import {Model} from 'mongoose';
import {Expense} from '../../models/expenses/Expense';
import {CreateExpenseFunction} from './index';
import {Dinero} from 'dinero.js';
import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {ExpenseFrequency} from './enum/expense-frequency';

export const makeCreateExpense = (
    logger: Logger,
    generateId: GenerateIdFunction,
    PropertyModel: Model<Property>,
    UserModel: Model<User>,
    ExpenseModel: Model<Expense>,
): CreateExpenseFunction => {
  return async function createExpense(
      propertyId: string,
      title: string,
      amount: Dinero,
      frequency: ExpenseFrequency,
      startDate: Date,
      endDate: Date,
      user: User,
  ) {
    const property = await PropertyModel.findOne({id: propertyId},
        {
          __v: 0,
        });
    if (!property) {
      return {
        status: 400,
        data: undefined,
      };
    }
    const propertyAdminUser = await UserModel.findOne({_id: property.admin},
        {
          _id: 0,
          __v: 0,
        });
    if (propertyAdminUser.email !== user.email) {
      return {
        status: 403,
        data: undefined,
      };
    }
    const id = await generateId();
    const expense: Expense = {
      id,
      title,
      property,
      frequency,
      startDate,
      endDate,
      amount: amount.toFormat(),
      createdBy: user,
    };

    try {
      await new ExpenseModel(expense).save();
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 201,
      data: {
        id,
        title,
        frequency: frequency,
        amount: amount.toFormat(),
        startDate,
        endDate,
        propertyId,
        createdBy: user.email,
      },
    };
  };
};

import {Logger} from '../../generic/Logger';
import {Model} from 'mongoose';
import {Expense} from '../../models/expenses/Expense';
import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {ExpenseFrequency} from './enum/expense-frequency';
import {UpdateExpenseFunction} from './index';
import Dinero from 'dinero.js';

export const makeUpdateExpense = (
    logger: Logger,
    PropertyModel: Model<Property>,
    UserModel: Model<User>,
    ExpenseModel: Model<Expense>,
): UpdateExpenseFunction => {
  return async function updateExpense(
      expenseId: string,
      title: string,
      amount: string,
      frequency: ExpenseFrequency,
      startDate: Date,
      endDate: Date,
      user: User,
  ) {
    const expense = await ExpenseModel.findOne({id: expenseId},
        {__v: 0});
    if (!expense) {
      return {
        status: 404,
        data: undefined,
      };
    }
    const property = await PropertyModel.findOne({_id: expense.property},
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

    expense.title = title;
    // eslint-disable-next-line new-cap,max-len
    expense.amount = Dinero({amount: Number(amount) * 100, currency: 'EUR', precision: 2}).toFormat();
    expense.frequency = frequency;
    expense.startDate = startDate;
    expense.endDate = endDate;
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
      status: 204,
      data: undefined,
    };
  };
};

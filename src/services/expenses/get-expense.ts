import {GetExpenseFunction} from './index';
import {User} from '../../models/User';
import {StatusDataContainer} from '../../data/StatusDataContainer';
import {ExpenseDto} from '../../data/dto/expenses/ExpenseDto';
import {Model} from 'mongoose';
import {Expense} from '../../models/expenses/Expense';
import {Property} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';

export const makeGetExpense = (
    logger: Logger,
    ExpenseModel: Model<Expense>,
    PropertyModel: Model<Property>,
    UserModel: Model<User>,
): GetExpenseFunction => {
  return async function getExpense(
      user: User,
      id: string,
  ): Promise<StatusDataContainer<ExpenseDto>> {
    const expense = await ExpenseModel.findOne({id: id},
        {
          _id: 0,
          __v: 0,
        });


    if (!expense) {
      return {
        status: 404,
        data: undefined,
      };
    }

    const expenseProperty = await PropertyModel.findOne({_id: expense.property},
        {
          _id: 0,
          __v: 0,
        });

    const expensePropertyUser = await UserModel.findOne({_id: expenseProperty.admin},
        {
          _id: 0,
          __v: 0,
        });

    if (expenseProperty.tenantEmails.includes(user.email) ||
        expensePropertyUser.email === user.email) {
      return {
        status: 200,
        data: {
          id: expense.id,
          amount: expense.amount,
          frequency: expense.frequency,
          createdBy: user.email,
          propertyId: expenseProperty.id,
        },
      };
    }
    return {
      status: 403,
      data: undefined,
    };
  };
};

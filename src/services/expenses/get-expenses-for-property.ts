import {Model} from 'mongoose';
import {Expense} from '../../models/expenses/Expense';
import {User} from '../../models/User';
import {GetExpensesForPropertyFunction} from './index';
import {Property} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';
import {ExpenseDto} from '../../data/dto/expenses/ExpenseDto';
import {SystemUser} from '../../config/SystemUser';

export const makeGetExpensesForProperty = (
    logger: Logger,
    PropertyModel: Model<Property>,
    UserModel: Model<User>,
    ExpenseModel: Model<Expense>,
): GetExpensesForPropertyFunction => {
  return async function getExpensesForProperty(
      propertyId: string,
      user: User,
  ) {
    const property = await PropertyModel
        .findOne({id: propertyId});
    const propertyAdmin = await UserModel
        .findOne({_id: property.admin});
    const propertyCreatedBy = await UserModel
        .findOne({_id: property.createdBy});
    if (propertyAdmin.email !== user.email &&
        propertyCreatedBy.email !== user.email &&
        SystemUser.email !== user.email) {
      return {
        status: 403,
        data: undefined,
      };
    }
    const expenses = await ExpenseModel.find({property: property._id});

    const transformedExpenses: ExpenseDto[] = [];

    for (const expense of expenses) {
      transformedExpenses.push({
        id: expense.id,
        propertyId,
        amount: expense.amount,
        frequency: expense.frequency,
        startDate: expense.startDate,
        endDate: expense.endDate,
        createdBy: expense.createdBy.email,
      });
    }

    return {
      status: 200,
      data: transformedExpenses,
    };
  };
};

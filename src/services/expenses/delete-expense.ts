import {StatusDataContainer} from '../../data/StatusDataContainer';
import {Property} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';
import {User} from '../../models/User';
import {ExpenseDto} from '../../data/dto/expenses/ExpenseDto';
import {Expense} from '../../models/expenses/Expense';
import {Model} from 'mongoose';
import {DeleteExpenseFunction} from './index';

export const makeDeleteExpense = (
    logger: Logger,
    ExpenseModel: Model<Expense>,
    PropertyModel: Model<Property>,
): DeleteExpenseFunction => {
  return async function deleteExpense(
      user: User,
      id: string,
  ): Promise<StatusDataContainer<ExpenseDto>> {
    const expense = await ExpenseModel.findOne({id},
        {__v: 0});
    if (!expense) {
      return {
        status: 404,
        data: undefined,
      };
    }

    const property = await PropertyModel.findOne({_id: expense.property},
        {__v: 0});
    if (!property) {
      // eslint-disable-next-line max-len
      logger.error('Attempting to delete expense for property that does not exist');
      return {
        status: 500,
        data: undefined,
      };
    }

    // Comparison invalid unless both are strings
    // @ts-ignore
    if (String(property.admin) !== String(user._id)) {
      return {
        status: 403,
        data: undefined,
      };
    }
    try {
      await ExpenseModel.deleteOne({id});
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

import {StatusDataContainer} from '../../data/StatusDataContainer';
import {ExpenseDto} from '../../data/dto/expenses/ExpenseDto';
import {Dinero} from 'dinero.js';
import {User, UserModel} from '../../models/User';
import {loggerConfig} from '../../config/Logger';
import {makeCreateExpense} from './create-expense';
import {generateId} from '../id';
import {PropertyModel} from '../../models/properties/Property';
import {ExpenseModel} from '../../models/expenses/Expense';
import {makeGetExpense} from './get-expense';
import {ExpenseFrequency} from './enum/expense-frequency';
import {makeGetExpensesForProperty} from './get-expenses-for-property';
import {makeUpdateExpense} from './update-expense';
import {makeDeleteExpense} from './delete-expense';

const logger = loggerConfig();

export type GetExpenseFunction = (
    user: User,
    id: string,
) => Promise<StatusDataContainer<ExpenseDto>>;
export const getExpense = makeGetExpense(
    logger,
    ExpenseModel,
    PropertyModel,
    UserModel,
);

export type CreateExpenseFunction = (
    propertyId: string,
    title: string,
    amount: Dinero,
    frequency: ExpenseFrequency,
    startDate: Date,
    endDate: Date,
    user: User,
) => Promise<StatusDataContainer<ExpenseDto>>;
export const createExpense = makeCreateExpense(
    logger,
    generateId,
    PropertyModel,
    UserModel,
    ExpenseModel,
);

export type GetExpensesForPropertyFunction = (
    propertyId: string,
    user: User,
) => Promise<StatusDataContainer<ExpenseDto[]>>;
export const getExpensesForProperty = makeGetExpensesForProperty(
    logger,
    PropertyModel,
    UserModel,
    ExpenseModel,
);

export type UpdateExpenseFunction = (
    expenseId: string,
    title: string,
    amount: string,
    frequency: ExpenseFrequency,
    startDate: Date,
    endDate: Date,
    user: User,
) => Promise<StatusDataContainer<ExpenseDto>>;
export const updateExpense = makeUpdateExpense(
    logger,
    PropertyModel,
    UserModel,
    ExpenseModel,
);

export type DeleteExpenseFunction = (
    user: User,
    id: string,
) => Promise<StatusDataContainer<ExpenseDto>>;
export const deleteExpense = makeDeleteExpense(
    logger,
    ExpenseModel,
    PropertyModel,
);

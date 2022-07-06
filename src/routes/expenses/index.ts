import express from 'express';
import {loggerConfig} from '../../config/Logger';
import {configureGetExpenseRoute} from './get-expense-route';
import {configurePostExpenseRoute} from './post-expense-route';
import {createExpense, deleteExpense, getExpense, getExpensesForProperty, updateExpense} from
        '../../services/expenses';
import {configureGetExpensesForPropertyRoute} from
  './get-expenses-for-property-route';
import {configurePatchExpenseRoute} from './patch-expense-route';
import {configureDeleteExpenseRoute} from "./delete-expense-route";

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

configureGetExpenseRoute(
    logger,
    router,
    getExpense,
);
configureGetExpensesForPropertyRoute(
    logger,
    router,
    getExpensesForProperty,
);
configurePostExpenseRoute(
    logger,
    router,
    createExpense,
);
configurePatchExpenseRoute(
    logger,
    router,
    updateExpense,
);
configureDeleteExpenseRoute(
    logger,
    router,
    deleteExpense,
);

export {router as ExpensesRouter};

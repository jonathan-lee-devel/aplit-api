import express from 'express';
import {loggerConfig} from '../../config/Logger';
import {configureGetExpenseRoute} from './get-expense-route';
import {configurePostExpenseRoute} from './post-expense-route';
import {createExpense, getExpense} from '../../services/expenses';

const logger = loggerConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

configureGetExpenseRoute(
    logger,
    router,
    getExpense,
);
configurePostExpenseRoute(
    logger,
    router,
    createExpense,
);

export {router as ExpensesRouter};

import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {CreateExpenseFunction} from '../../services/expenses';
import Dinero from 'dinero.js';
import {ExpenseFrequency} from '../../services/expenses/enum/expense-frequency';

export const configurePostExpenseRoute = (
    logger: Logger,
    router: Router,
    createExpense: CreateExpenseFunction,
) => {
  router.post('/create',
      body('propertyId', 'Must be a valid propertyId')
          .exists(),
      body('amount', 'Must be a non-negative integer')
          .exists()
          .isInt({min: 0}),
      body('frequency', 'Must be a valid frequency')
          .exists()
          .isInt({min: ExpenseFrequency.ONCE, max: ExpenseFrequency.YEARLY}),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {propertyId, amount, frequency} = req.body;

        // eslint-disable-next-line new-cap
        const dineroAmount = Dinero({amount, currency: 'EUR', precision: 2});

        const expenseContainer = await createExpense(
            propertyId,
            dineroAmount,
            frequency,
            // @ts-ignore
            req.user,
        );


        if (expenseContainer.status === 201 ||
            expenseContainer.status === 403) {
          return res
              .status(expenseContainer.status)
              .json(expenseContainer.data);
        } else if (expenseContainer.status === 400) {
          return res
              .status(expenseContainer.status)
              .json({error: 'Bad request, property does not exist'});
        }
        logger.error('Error has occurred while creating expense');
        return res.status(500).json({message: 'An error has occurred'});
      });
};

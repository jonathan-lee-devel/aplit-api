import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {CreateExpenseFunction} from '../../services/expenses';
import Dinero from 'dinero.js';
import {ExpenseFrequency} from '../../services/expenses/enum/expense-frequency';
import {isAfter} from 'date-fns';

export const configurePostExpenseRoute = (
    logger: Logger,
    router: Router,
    createExpense: CreateExpenseFunction,
) => {
  router.post('/create',
      body('propertyId', 'Must be a valid propertyId')
          .exists(),
      body('title', 'Must be a valid title')
          .exists()
          .isLength({min: 1, max: 30}),
      body('amount', 'Must be a non-negative integer')
          .exists()
          .isInt({min: 0}),
      body('frequency', 'Must be a valid frequency')
          .exists()
          .isInt({min: ExpenseFrequency.ONCE, max: ExpenseFrequency.YEARLY}),
      body('startDate', 'Must be a valid start date')
          .exists()
          .custom((input, {req}) => {
            try {
              const startDate = new Date(input);
              const endDate = new Date(req.body.endDate);

              return isAfter(endDate, startDate);
            } catch (err) {
              return false;
            }
          }),
      body('endDate', 'Must be a valid end date')
          .exists()
          .custom((input) => {
            try {
              const date = new Date(input);
              return isAfter(date, new Date());
            } catch (err) {
              return false;
            }
          }),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {
          propertyId, title, amount, frequency, startDate, endDate,
        } = req.body;

        // eslint-disable-next-line new-cap
        const dineroAmount = Dinero({amount, currency: 'EUR', precision: 2});

        const expenseContainer = await createExpense(
            propertyId,
            title,
            dineroAmount,
            frequency,
            startDate,
            endDate,
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

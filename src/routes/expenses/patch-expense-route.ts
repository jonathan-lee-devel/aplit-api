import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {UpdateExpenseFunction} from '../../services/expenses';
import {ExpenseFrequency} from '../../services/expenses/enum/expense-frequency';
import {isAfter} from 'date-fns';

export const configurePatchExpenseRoute = (
    logger: Logger,
    router: Router,
    updateExpense: UpdateExpenseFunction,
) => {
  router.patch('/update',
      body('id', 'Must be a valid expense ID')
          .exists(),
      body('propertyId', 'Must be a valid propertyId')
          .exists(),
      body('title', 'Must be a valid title')
          .exists()
          .isLength({min: 1, max: 30}),
      body('amount', 'Must be a non-negative float')
          .exists()
          .isFloat({min: 0.00}),
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
          id,
          title, amount, frequency, startDate, endDate,
        } = req.body;

        const expenseContainer = await updateExpense(
            id,
            title,
            // eslint-disable-next-line new-cap
            amount,
            frequency,
            startDate,
            endDate,
            // @ts-ignore
            req.user,
        );

        if (expenseContainer.status === 204 ||
                expenseContainer.status === 403 ||
                expenseContainer.status === 404) {
          return res
              .status(expenseContainer.status)
              .json(expenseContainer.data);
        } else if (expenseContainer.status === 400) {
          return res
              .status(expenseContainer.status)
              .json({error: 'Bad request, property does not exist'});
        }
        logger.error('Error has occurred while updating expense');
        return res.status(500).json({message: 'An error has occurred'});
      });
};

import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {GetExpenseFunction} from '../../services/expenses';

export const configureGetExpenseRoute = (
    logger: Logger,
    router: Router,
    getExpense: GetExpenseFunction,
) => {
  router.get('/:id', isLoggedIn, async (req, res, _) => {
    // @ts-ignore
    const expenseContainer = await getExpense(req.user, req.params.id);
    switch (expenseContainer.status) {
      case 200:
        return res
            .status(expenseContainer.status)
            .json(expenseContainer.data);
      case 403:
        logger.info(
            // @ts-ignore
            // eslint-disable-next-line max-len
            `Unauthorized access prevented: {"username":"${req.user.email}"} {"expense.id":"${req.params.id}"}`,
        );
        return res
            .status(expenseContainer.status)
            .json(expenseContainer.data);
      case 404:
        logger.info(
            // @ts-ignore
            // eslint-disable-next-line max-len
            `Data not found: {"username":"${req.user.email}"} {"expense.id":"${req.params.id}"}`,
        );
        return res
            .status(expenseContainer.status)
            .json({error: 'No data found'});
      default:
        logger.error(
            `Unrecognized status: ${expenseContainer.status}`,
        );
        return res
            .status(500)
            .json({error: 'An undefined error has occurred'});
    }
  });
};

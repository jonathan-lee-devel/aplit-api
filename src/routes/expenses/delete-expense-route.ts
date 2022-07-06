import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {DeleteExpenseFunction} from '../../services/expenses';

export const configureDeleteExpenseRoute = (
    logger: Logger,
    router: Router,
    deleteExpense: DeleteExpenseFunction,
) => {
  router.delete('/delete/:id', isLoggedIn, async (req, res, _) => {
    try {
      // @ts-ignore
      const expenseContainer = await deleteExpense(req.user, req.params.id);
      switch (expenseContainer.status) {
        case 204:
          return res
              .status(expenseContainer.status)
              .json(expenseContainer.data);
        case 403:
          logger.info(
              // @ts-ignore
              // eslint-disable-next-line max-len
              `Unauthorized access prevented: {"username":"${req.user.email}"} {"expense.id":"${req.params.id}"}`);
          return res
              .status(expenseContainer.status)
              .json(expenseContainer.data);
        case 404:
          logger.info(
              // @ts-ignore
              // eslint-disable-next-line max-len
              `Data not found: {"username":"${req.user.email}"} {"expense.id":"${req.params.id}"}`);
          return res
              .status(expenseContainer.status)
              .json({error: 'No data found'});
        default:
          logger.error(
              `Unrecognized status: ${expenseContainer.status}`);
          return res
              .status(500)
              .json({error: 'An undefined error has occurred'});
      }
    } catch (err) {
      logger.error(`Error has occurred: ${err.message}`);
      return res.status(500).json({error: 'An error has occurred'});
    }
  });
};

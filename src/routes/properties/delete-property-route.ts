import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {DeletePropertyFunction} from '../../services/properties';

export const configureDeletePropertyRoute = (
    logger: Logger,
    router: Router,
    deleteProperty: DeletePropertyFunction,
) => {
  router.delete('/delete/:id', isLoggedIn, async (req, res, _) => {
    try {
      // @ts-ignore
      const propertyContainer = await deleteProperty(req.user, req.params.id);
      switch (propertyContainer.status) {
        case 204:
          return res
              .status(propertyContainer.status)
              .json(propertyContainer.data);
        case 403:
          logger.info(
              // @ts-ignore
              // eslint-disable-next-line max-len
              `Unauthorized access prevented: {"username":"${req.user.email}"} {"property.id":"${req.params.id}"}`);
          return res
              .status(propertyContainer.status)
              .json(propertyContainer.data);
        case 404:
          logger.info(
              // @ts-ignore
              // eslint-disable-next-line max-len
              `Data not found: {"username":"${req.user.email}"} {"property.id":"${req.params.id}"}`);
          return res
              .status(propertyContainer.status)
              .json({error: 'No data found'});
        default:
          logger.error(
              `Unrecognized status: ${propertyContainer.status}`);
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

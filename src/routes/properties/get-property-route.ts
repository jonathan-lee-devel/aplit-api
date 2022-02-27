import {Router} from 'express';
import {isLoggedIn} from '../../config/Auth';
import {getProperty} from '../../services/properties';
import {Logger} from '../../generic/Logger';

/**
 * Configure GET property route.
 *
 * @param {Logger} logger used for logging
 * @param {Router} router used for routing
 */
export const configureGetPropertyRoute = (
    logger: Logger,
    router: Router,
) => {
  router.get('/:id', isLoggedIn, async (req, res, _) => {
    try {
      // @ts-ignore
      const propertyContainer = await getProperty(req.user, req.params.id);
      switch (propertyContainer.status) {
        case 200:
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

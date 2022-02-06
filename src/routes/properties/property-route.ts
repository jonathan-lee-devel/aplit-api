import npmlog from 'npmlog';
import {Router} from 'express';

export const propertyRoute = (
    logger: npmlog.Logger,
    router: Router,
) => {
  router.get('/:id', async (req, res, _) => {
    return res.status(200).json({
      id: req.params.id,
    });
  });
};

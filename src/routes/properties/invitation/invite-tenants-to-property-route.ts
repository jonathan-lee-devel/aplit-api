import {Logger} from '../../../generic/Logger';
import {Router} from 'express';
import {isLoggedIn} from '../../../config/Auth';
import {body, validationResult} from 'express-validator';
import {InviteToPropertyFunction} from '../../../services/properties';
import {VerifyEmailFunction} from '../../../services/email';
import {Model} from 'mongoose';
import {Property} from '../../../models/properties/Property';

export const configureInviteTenantsToPropertyRoute = (
    logger: Logger,
    router: Router,
    verifyEmail: VerifyEmailFunction,
    PropertyModel: Model<Property>,
    inviteToProperty: InviteToPropertyFunction,
) => {
  router.patch('/tenant-invite',
      body('propertyId', 'Must be a valid property ID')
          .exists(),
      body('tenantEmails', 'Must be a valid e-mail address')
          .exists()
          .custom((input) => {
            for (const email of input.toString().split(',')) {
              if (!verifyEmail(email)) {
                return false;
              }
            }
            return true;
          }),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {propertyId, tenantEmails} = req.body;

        const property = await PropertyModel.findOne({id: propertyId},
            {_id: 0, __v: 0});
        // @ts-ignore
        if (String(property.admin) !== String(req.user._id)) {
          return res
              .status(403)
              .json({error: 'Permission denied'});
        }

        for (const tenantEmail of tenantEmails) {
          if (property.tenantEmails.includes(tenantEmail)) {
            return res
                .status(400)
                .json({
                  error: 'Tenant email provided already exists for property',
                });
          }
        }
        for (const tenantEmail of tenantEmails) {
          // @ts-ignore
          await inviteToProperty(propertyId, req.user.email, tenantEmail);
        }

        return res
            .status(204)
            .json(undefined);
      },
  );
};

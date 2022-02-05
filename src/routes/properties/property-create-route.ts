import {Router} from 'express';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import npmlog from 'npmlog';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {verifyEmail} from '../../services/email/verify-email';
import {
  PropertyCreationStatus,
} from '../../services/properties/enum/property-creation-status';
import {propertyCreate} from '../../services/properties/property-create';
import {getLoggingPrefix} from '../../config/Logger';

export const propertyCreateRoute = (
    router: Router,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    logger: npmlog.Logger,
) => {
  router.post('/create',
      body('title', 'Title must be of length 5-25 characters')
          .exists()
          .isLength({min: 5, max: 25}),
      body('tenants', 'Only valid e-mail addresses are allowed')
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
          logger.info(getLoggingPrefix(), 'Bad request: %j', errors.array());
          return res.status(400).json({errors: errors.array()});
        }

        const {title, tenants} = req.body;

        const propertyCreationStatus = await propertyCreate(
            transporter,
            title,
            tenants,
            // @ts-ignore
            req.user,
        );

        switch (propertyCreationStatus) {
          case PropertyCreationStatus.SUCCESS:
            return res.status(200).json({
              title, tenants,
            });
          default:
            return res.status(500)
                .json(
                    {propertyCreationStatus: propertyCreationStatus},
                );
        }
      },
  );
};

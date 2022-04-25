import {Logger} from '../../generic/Logger';
import {Router} from 'express';
import {CreateNotificationFunction} from '../../services/notifications';
import {body, validationResult} from 'express-validator';
import {isLoggedIn} from '../../config/Auth';
import {ObtainUserFromEmailFunction, VerifyEmailFunction} from
  '../../services/email';

export const configurePostUserNotificationRoute = (
    logger: Logger,
    router: Router,
    verifyEmail: VerifyEmailFunction,
    obtainUserFromEmail: ObtainUserFromEmailFunction,
    createNotification: CreateNotificationFunction,
) => {
  router.post('/create',
      body('user', 'Must be a valid e-mail address')
          .exists()
          .isEmail()
          .custom((input) => {
            return verifyEmail(input);
          }),
      body('subject', 'Subject must be of length 5-25 characters')
          .exists()
          .isLength({min: 5, max: 25}),
      body('content', 'Content must be of length 5-50 characters')
          .exists()
          .isLength({min: 5, max: 50}),
      isLoggedIn,
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(`Bad request: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({errors: errors.array()});
        }

        const {user, subject, content} = req.body;

        const obtainedUser = await obtainUserFromEmail(user);
        if (!obtainedUser) {
          return res
              .status(400)
              .json({error: `Bad request: User ${user} does not exist`});
        }

        const notificationContainer = await createNotification(
            obtainedUser,
            subject,
            content,
        );

        if (notificationContainer.status === 201) {
          return res
              .status(notificationContainer.status)
              .json(notificationContainer.data);
        }
        logger.error(
            'Error has occurred while creating notification',
        );
        return res.status(500).json({message: 'An error has occurred'});
      });
};

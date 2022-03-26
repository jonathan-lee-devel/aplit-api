import {Logger} from '../../../generic/Logger';
import {Router} from 'express';
import {query, validationResult} from 'express-validator';
import {PropertyInvitationStatus} from
  '../../../services/properties/enum/invitation/property-invitation-status';
import {
  ConfirmPropertyInvitationFunction,
  GetPropertyIdFromInvitationTokenFunction,
} from '../../../services/properties';
import {FormatPropertyInvitationResponseFunction} from '../index';

export const configureGetConfirmPropertyInvitationRoute = (
    logger: Logger,
    router: Router,
    confirmPropertyInvitation: ConfirmPropertyInvitationFunction,
    getPropertyIdFromInvitationToken: GetPropertyIdFromInvitationTokenFunction,
    formatPropertyInvitationResponse: FormatPropertyInvitationResponseFunction,
) => {
  router.get('/invitations/confirm',
      query('token').exists(),
      async (req, res, _) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.info(
              `Bad request: ${JSON.stringify(errors.array())}`,
          );
          return res.status(400).json({errors: errors.array()});
        }
        const {token} = req.query;
        if (!token) {
          // Strange behaviour with express-validator for query parameter
          logger.info(
              `Bad request: missing required query parameter 'token'`,
          );
          return res.status(400).json({
            errors: [
              {
                value: token,
                msg: `Query parameter 'token' is required`,
                param: 'token',
                location: 'query',
              },
            ],
          });
        }

        const propertyInvitationStatus = await confirmPropertyInvitation(token);
        let propertyId;
        if (propertyInvitationStatus === PropertyInvitationStatus.SUCCESS) {
          propertyId = await getPropertyIdFromInvitationToken(token);
        }

        switch (propertyInvitationStatus) {
          case PropertyInvitationStatus.SUCCESS:
            return res.redirect(
                `${process.env.FRONT_END_URL}/property/view/${propertyId}`,
            );
          case PropertyInvitationStatus.INVALID_TOKEN:
          case PropertyInvitationStatus.EMAIL_VERIFICATION_EXPIRED:
            return formatPropertyInvitationResponse(
                res, 400, propertyInvitationStatus,
            );
          default:
            return formatPropertyInvitationResponse(
                res, 500, propertyInvitationStatus,
            );
        }
      });
};

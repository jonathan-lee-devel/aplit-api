import {Response} from 'express-serve-static-core';
import {PropertyInvitationStatus} from
  '../../../../services/properties/enum/invitation/property-invitation-status';
import {FormatPropertyInvitationResponseFunction} from '../../index';

export const makeFormatPropertyInvitationResponse = ()
    : FormatPropertyInvitationResponseFunction => {
  return function formatPropertyInvitationResponse(
      res: Response,
      httpStatus: number,
      propertyInvitationStatus: PropertyInvitationStatus,
  ) {
    res
        .status(httpStatus)
        .json({
          property_invitation_status:
              PropertyInvitationStatus[propertyInvitationStatus],
        });
  };
};

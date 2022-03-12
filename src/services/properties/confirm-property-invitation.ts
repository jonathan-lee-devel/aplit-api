import {HydratedDocument} from 'mongoose';
import {PropertyInvitation} from '../../models/properties/PropertyInvitation';
import {Property} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';
import {PropertyInvitationStatus} from './enum/property-invitation-status';

export const makeConfirmPropertyInvitation = (
    logger: Logger,
    propertyInvitationModel: any,
    propertyModel: any,
) => {
  return async function confirmPropertyInvitation(
      propertyInvitationId: string,
  ): Promise<PropertyInvitationStatus> {
    const foundPropertyInvitation: HydratedDocument<PropertyInvitation> =
            await propertyInvitationModel.findOne({id: propertyInvitationId});

    if (!foundPropertyInvitation) {
      return PropertyInvitationStatus.INVALID_TOKEN;
    }

    const foundProperty: HydratedDocument<Property> =
            await propertyModel
                .findOne({id: foundPropertyInvitation.propertyId});

    if (foundPropertyInvitation.expiryDate.getTime() >
    new Date().getTime()) {
      if (
        foundProperty.tenantEmails
            .includes(foundPropertyInvitation.inviteeEmail)) {
        // @ts-ignore
        foundPropertyInvitation.accepted = true;
        try {
          await foundPropertyInvitation.save();
          return PropertyInvitationStatus.SUCCESS;
        } catch (err) {
          logger.error(`An error has occurred: ${err.message}`);
        }
      } else {
        return PropertyInvitationStatus.FAILURE;
      }
    }
    return PropertyInvitationStatus.EMAIL_VERIFICATION_EXPIRED;
  };
};

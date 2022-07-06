import {Model} from 'mongoose';
import {Logger} from '../../../generic/Logger';
import {ConfirmPropertyInvitationFunction} from '../index';
import {PropertyInvitationStatus} from
  '../enum/invitation/property-invitation-status';
import {PropertyInvitationToken} from
  '../../../models/properties/invitation/PropertyInvitationToken';
import {PropertyInvitation} from
  '../../../models/properties/invitation/PropertyInvitation';
import {Property} from '../../../models/properties/Property';

export const makeConfirmPropertyInvitation = (
    logger: Logger,
    PropertyInvitationTokenModel: Model<PropertyInvitationToken>,
    PropertyInvitationModel: Model<PropertyInvitation>,
    PropertyModel: Model<Property>,
): ConfirmPropertyInvitationFunction => {
  return async function confirmPropertyInvitation(
      tokenValue: string,
  ): Promise<PropertyInvitationStatus> {
    const token =
        await PropertyInvitationTokenModel.findOne({value: tokenValue});

    if (!token) {
      logger
          .error('Invalid property invitation token provided');
      return PropertyInvitationStatus.INVALID_TOKEN;
    }

    const invitation =
        await PropertyInvitationModel.findOne({propertyInvitationToken: token});

    if (!invitation) {
      logger
          .error('Property invitation token without an associated invitation');
      return PropertyInvitationStatus.FAILURE;
    }

    if (new Date().getTime() > token.expiryDate.getTime()) {
      return PropertyInvitationStatus.EMAIL_VERIFICATION_EXPIRED;
    }

    const property = await PropertyModel.findOne({id: invitation.propertyId});
    if (!property) {
      logger.error('Associated property for invitation has been deleted');
      return PropertyInvitationStatus.FAILURE;
    }

    token.expiryDate = new Date();
    invitation.accepted = true;
    try {
      await token.save();
      await invitation.save();
      await property.save();
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return PropertyInvitationStatus.FAILURE;
    }

    return PropertyInvitationStatus.SUCCESS;
  };
};

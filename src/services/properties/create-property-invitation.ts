import {Logger} from '../../generic/Logger';
import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {PropertyInvitationDto}
  from '../../dto/properties/PropertyInvitationDto';
import {PropertyInvitation, PropertyInvitationModel}
  from '../../models/properties/PropertyInvitation';
import {DEFAULT_EXPIRY_TIME_DAYS} from '../../config/Token';

export const makeCreatePropertyInvitation = (
    logger: Logger,
    generateId: Function,
) => {
  return async function createPropertyInvitation(
      propertyId: string,
      inviteeEmail: string,
      inviterEmail: string,
  ): Promise<StatusContainerDto<PropertyInvitationDto>> {
    const id = generateId(logger);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + DEFAULT_EXPIRY_TIME_DAYS);
    const propertyInvitation: PropertyInvitation = {
      id,
      propertyId,
      inviteeEmail,
      inviterEmail,
      accepted: false,
      expiryDate,
    };

    try {
      await new PropertyInvitationModel(propertyInvitation).save();
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 201,
      data: {
        propertyId: propertyInvitation.propertyId,
        inviteeEmail: propertyInvitation.inviteeEmail,
        inviterEmail: propertyInvitation.inviterEmail,
        accepted: propertyInvitation.accepted,
      },
    };
  };
};

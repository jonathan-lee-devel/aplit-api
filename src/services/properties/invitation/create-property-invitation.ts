import {Logger} from '../../../generic/Logger';
import {Model} from 'mongoose';
import {PropertyInvitation}
  from '../../../models/properties/invitation/PropertyInvitation';
import {PropertyInvitationToken}
  from '../../../models/properties/invitation/PropertyInvitationToken';
import {DEFAULT_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';
import {StatusDataContainer} from '../../../data/StatusDataContainer';

export const makeCreatePropertyInvitation = (
    logger: Logger,
    generateId: Function,
    generatePropertyInvitationToken: Function,
    PropertyInvitationTokenModel: Model<PropertyInvitationToken>,
    PropertyInvitationModel: Model<PropertyInvitation>,
) => {
  return async function createPropertyInvitation(
      propertyId: string,
      inviteeEmail: string,
      inviterEmail: string,
  ): Promise<StatusDataContainer<PropertyInvitation>> {
    const propertyInvitation: PropertyInvitation = {
      id: await generateId(logger),
      propertyId: propertyId,
      inviteeEmail: inviteeEmail,
      inviterEmail: inviterEmail,
      accepted: false,
      propertyInvitationToken: null,
    };
    const propertyInvitationToken = await generatePropertyInvitationToken(
        DEFAULT_TOKEN_SIZE,
        DEFAULT_EXPIRY_TIME_DAYS,
        propertyId,
    );

    try {
      propertyInvitation.propertyInvitationToken =
          await new PropertyInvitationTokenModel(propertyInvitationToken)
              .save();
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
        id: propertyInvitation.id,
        propertyId: propertyInvitation.propertyId,
        inviteeEmail: propertyInvitation.inviteeEmail,
        inviterEmail: propertyInvitation.inviterEmail,
        accepted: propertyInvitation.accepted,
        propertyInvitationToken: propertyInvitationToken,
      },
    };
  };
};

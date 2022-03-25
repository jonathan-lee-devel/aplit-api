import {Logger} from '../../../generic/Logger';
import {Model} from 'mongoose';
import {PropertyInvitation}
  from '../../../models/properties/invitation/PropertyInvitation';
import {PropertyInvitationToken}
  from '../../../models/properties/invitation/PropertyInvitationToken';
import {DEFAULT_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';
import {StatusDataContainer} from '../../../data/StatusDataContainer';
import {
  CreatePropertyInvitationFunction,
  GeneratePropertyInvitationTokenFunction,
} from '../index';
import {GenerateIdFunction} from '../../id';

/**
 * Maker-function to create a property invitation.
 *
 * @param {Logger} logger used for logging
 * @param {GenerateIdFunction} generateId used to generate ID
 * @param {GeneratePropertyInvitationTokenFunction} generatePropertyInvitationToken used to generate token
 * @param {Model<PropertyInvitationToken>} PropertyInvitationTokenModel for db
 * @param {Model<PropertyInvitation>} PropertyInvitationModel for db
 * @return {CreatePropertyInvitationFunction} to create property invitation
 */
export const makeCreatePropertyInvitation = (
    logger: Logger,
    generateId: GenerateIdFunction,
    generatePropertyInvitationToken: GeneratePropertyInvitationTokenFunction,
    PropertyInvitationTokenModel: Model<PropertyInvitationToken>,
    PropertyInvitationModel: Model<PropertyInvitation>,
): CreatePropertyInvitationFunction => {
  /**
   * Function to create a property invitation.
   *
   * @param {string} propertyId id of property
   * @param {string} inviteeEmail tenant being invited
   * @param {string} inviterEmail tenant inviting
   * @return {Promise<StatusDataContainer<PropertyInvitation>>} invitation
   */
  return async function createPropertyInvitation(
      propertyId: string,
      inviteeEmail: string,
      inviterEmail: string,
  ): Promise<StatusDataContainer<PropertyInvitation>> {
    const propertyInvitation: PropertyInvitation = {
      id: await generateId(),
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

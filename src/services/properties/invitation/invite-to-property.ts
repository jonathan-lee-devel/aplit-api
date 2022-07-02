import {Logger} from '../../../generic/Logger';
import {
  CreatePropertyInvitationFunction,
  InviteToPropertyFunction,
  SendPropertyInvitationFunction,
} from '../index';
import {Property} from '../../../models/properties/Property';
import {Model} from 'mongoose';

/**
 * Maker-function to invite to property.
 *
 * @param {Logger} logger used for logging
 * @param {Model<Property>} PropertyModel used to add tenant to property
 * @param {CreatePropertyInvitationFunction} createPropertyInvitation to invite
 * @param {SendPropertyInvitationFunction} sendPropertyInvitation to send
 * @return {InviteToPropertyFunction} function to invite to property
 */
export const makeInviteToProperty = (
    logger: Logger,
    PropertyModel: Model<Property>,
    createPropertyInvitation: CreatePropertyInvitationFunction,
    sendPropertyInvitation: SendPropertyInvitationFunction,
): InviteToPropertyFunction => {
  /**
   * Function to invite to property.
   *
   * @param {string} propertyId id of property
   * @param {string} inviterEmail tenant inviting
   * @param {string} inviteeEmail tenant being invited
   * @return {void}
   */
  return async function inviteToProperty(
      propertyId: string,
      inviterEmail: string,
      inviteeEmail: string,
  ) {
    const property = await PropertyModel.findOne({id: propertyId});
    if (!property) {
      logger
          .error('Error cannot invite to property as property does not exist');
      return;
    }
    property.tenantEmails.push(inviteeEmail);
    await property.save();

    const propertyInvitationContainer =
          await createPropertyInvitation(
              propertyId,
              inviterEmail,
              inviteeEmail,
          );

    if (propertyInvitationContainer.status === 201) {
      sendPropertyInvitation(
          propertyInvitationContainer.data.propertyInvitationToken.value,
          inviterEmail,
          inviteeEmail,
      );
    } else {
      logger.error('An error has occurred, the invitation has not been sent');
    }
  };
};

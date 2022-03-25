import {Logger} from '../../../generic/Logger';
import {
  CreatePropertyInvitationFunction,
  InviteToPropertyFunction,
  SendPropertyInvitationFunction,
} from '../index';

/**
 * Maker-function to invite to property.
 *
 * @param {Logger} logger used for logging
 * @param {CreatePropertyInvitationFunction} createPropertyInvitation to invite
 * @param {SendPropertyInvitationFunction} sendPropertyInvitation to send
 * @return {InviteToPropertyFunction} function to invite to property
 */
export const makeInviteToProperty = (
    logger: Logger,
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

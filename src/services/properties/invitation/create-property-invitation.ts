import {Logger} from '../../../generic/Logger';
import {Mailer} from '../../../generic/Mailer';
import {PropertyInvitation, PropertyInvitationModel}
  from '../../../models/properties/invitation/PropertyInvitation';
import {DEFAULT_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';
import {StatusContainerDto} from '../../../dto/StatusContainerDto';
import {PropertyInvitationDto}
  from '../../../dto/properties/PropertyInvitationDto';

/**
 * Maker-function for the function to create property invitations.
 *
 * @param {Logger} logger used for logging
 * @param {Mailer} mailer used to send emails
 * @param {Function} generateId used to generated IDs
 * @param {Function} generatePropertyInvitationToken used to generate tokens
 * @return {Function} function to create property invitations
 */
export const makeCreatePropertyInvitation = (
    logger: Logger,
    mailer: Mailer,
    generateId: Function,
    generatePropertyInvitationToken: Function,
) => {
  /**
   * Function to create property invitations.
   *
   * @param {string} propertyId id of the property for invitation
   * @param {string} inviterEmail email of the inviter
   * @param {string} inviteeEmail email of the invitee
   * @return {Promise<StatusContainerDto<PropertyInvitationDto>>} invitation
   */
  return async function createPropertyInvitation(
      propertyId: string,
      inviterEmail: string,
      inviteeEmail: string,
  ): Promise<StatusContainerDto<PropertyInvitationDto>> {
    const propertyInvitation: PropertyInvitation = {
      id: await generateId(),
      propertyId: propertyId,
      inviterEmail: inviterEmail,
      inviteeEmail: inviteeEmail,
      propertyInvitationToken: await generatePropertyInvitationToken(
          DEFAULT_TOKEN_SIZE,
          DEFAULT_EXPIRY_TIME_DAYS,
          propertyId,
      ),
      accepted: false,
    };

    try {
      await new PropertyInvitationModel(propertyInvitation).save();
      mailer.sendMail(inviteeEmail, 'Split Invitation',
          // eslint-disable-next-line max-len
          `<h4>${inviterEmail} has invited you to manage your shared living space</h4>`);

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
        inviterEmail: propertyInvitation.inviterEmail,
        inviteeEmail: propertyInvitation.inviteeEmail,
        accepted: propertyInvitation.accepted,
      },
    };
  };
};

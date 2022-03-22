import {Logger} from '../../generic/Logger';

export const makeInviteToProperty = (
    logger: Logger,
    createPropertyInvitation: Function,
    sendPropertyInvitation: Function,
) => {
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

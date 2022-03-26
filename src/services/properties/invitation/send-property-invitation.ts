import {Logger} from '../../../generic/Logger';
import {Mailer} from '../../../generic/Mailer';
import {SendPropertyInvitationFunction} from '../index';

export const makeSendPropertyInvitation = (
    logger: Logger,
    mailer: Mailer,
): SendPropertyInvitationFunction => {
  return async function sendPropertyInvitation(
      propertyInvitationTokenValue: string,
      inviterEmail: string,
      inviteeEmail: string,
  ) {
    mailer.sendMail(
        inviteeEmail,
        'Split Property Invitation',
        // eslint-disable-next-line max-len
        `<h2>${inviterEmail} has invited you to manage a shared living space</h2>
<h3>Please click the following link to accept:
<a href="${process.env.BACK_END_URL}/properties/invitations/confirm?token=${propertyInvitationTokenValue}">Accept</a></h3>`,
    );
  };
};

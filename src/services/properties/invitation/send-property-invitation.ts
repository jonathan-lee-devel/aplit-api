import {Logger} from '../../../generic/Logger';
import {SendPropertyInvitationFunction} from '../index';
import {SendMailFunction} from '../../email';

export const makeSendPropertyInvitation = (
    logger: Logger,
    sendMail: SendMailFunction,
): SendPropertyInvitationFunction => {
  return async function sendPropertyInvitation(
      propertyInvitationTokenValue: string,
      inviterEmail: string,
      inviteeEmail: string,
  ) {
    sendMail(
        inviteeEmail,
        'Split Property Invitation',
        // eslint-disable-next-line max-len
        `<h2>${inviterEmail} has invited you to manage a shared living space</h2>
<h3>Please click the following link to accept:
<a href="${process.env.FRONT_END_URL}/property/invitation/verify/${propertyInvitationTokenValue}">Accept</a></h3>`,
    );
  };
};

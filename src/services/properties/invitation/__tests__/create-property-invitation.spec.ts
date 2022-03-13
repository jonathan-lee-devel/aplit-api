import {makeCreatePropertyInvitation} from '../create-property-invitation';
import {Mailer} from '../../../../generic/Mailer';

const logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};
// @ts-ignore
const mailer = new Mailer({});

describe('Create property invitation', () => {
  it('When makeCreatePropertyInvitation Then createPropertyInvitation',
      async () => {
        const generateId = () => {};
        const generatePropertyInvitationToken = () => {};
        const propertyInvitationModel = {};

        const createPropertyInvitation = makeCreatePropertyInvitation(
            logger,
            mailer,
            generateId,
            generatePropertyInvitationToken,
            // @ts-ignore
            propertyInvitationModel,
        );
        expect(createPropertyInvitation).not.toBeNull();
        expect(createPropertyInvitation).toBeInstanceOf(Function);
      });
});

import {makeGeneratePropertyInvitationToken}
  from '../generate-property-invitation-token';
import {DEFAULT_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE}
  from '../../../../config/Token';

describe('Generate property invitation token', () => {
  // eslint-disable-next-line max-len
  it('When makeGeneratePropertyInvitationToken Then generatePropertyInvitationToken',
      async () => {
        const propertyModel = {};
        const generatePropertyInvitationToken =
        // @ts-ignore
            makeGeneratePropertyInvitationToken(propertyModel);
        expect(generatePropertyInvitationToken).not.toBeNull();
        expect(generatePropertyInvitationToken).toBeInstanceOf(Function);
      });
  it('When generatePropertyInvitationToken Then token of given length',
      async () => {
        const propertyModel = {};
        const generatePropertyInvitationToken =
        // @ts-ignore
          makeGeneratePropertyInvitationToken(propertyModel);
        const token = await generatePropertyInvitationToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_DAYS,
            '12345',
        );
        const numberOfCharactersPerByte = 2;
        expect(token.value.toString().length)
            .toBe(DEFAULT_TOKEN_SIZE * numberOfCharactersPerByte);
      });
  it('When generatePropertyInvitationToken Then token not expired',
      async () => {
        const propertyModel = {};
        const generatePropertyInvitationToken =
        // @ts-ignore
          makeGeneratePropertyInvitationToken(propertyModel);
        const token = await generatePropertyInvitationToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_DAYS,
            '12345',
        );
        expect(token.expiryDate.getTime())
            .toBeGreaterThanOrEqual(new Date().getTime());
      });
});

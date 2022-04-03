import {makeGenerateRegistrationVerificationToken}
  from '../generate-registration-verification-token';
import {DEFAULT_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';


describe('Generate registration verification token', () => {
  // eslint-disable-next-line max-len
  it('When makeGenerateRegistrationVerificationToken Then generateRegistrationVerificationToken',
      async () => {
        const generateRegistrationVerificationToken =
            makeGenerateRegistrationVerificationToken();
        expect(generateRegistrationVerificationToken).not.toBeNull();
        expect(generateRegistrationVerificationToken).toBeInstanceOf(Function);
      });
  it('When generateRegistrationVerificationToken Then generate valid token',
      async () => {
        const generateRegistrationVerificationToken =
            makeGenerateRegistrationVerificationToken();

        const token = await generateRegistrationVerificationToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES,
        );

        expect(token).not.toBeNull();
        expect(token.expiryDate.getTime())
            .toBeGreaterThan(new Date().getTime());
      });
});

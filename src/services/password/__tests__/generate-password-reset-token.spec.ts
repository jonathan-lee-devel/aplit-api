import {makeGeneratePasswordResetToken} from '../generate-password-reset-token';
import {DEFAULT_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE}
  from '../../../config/Token';

describe('Generate password reset token', () => {
  it('When makeGeneratePasswordResetToken Then generatePasswordResetToken',
      async () => {
        const generatePasswordResetToken = makeGeneratePasswordResetToken();
        expect(generatePasswordResetToken).not.toBeNull();
        expect(generatePasswordResetToken).toBeInstanceOf(Function);
      });
  it('When generatePasswordResetToken Then token of given length',
      async () => {
        const generatePasswordResetToken = makeGeneratePasswordResetToken();
        const token = await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES,
        );
        const numberOfCharactersPerByte = 2;
        expect(token.value.toString().length)
            .toBe(DEFAULT_TOKEN_SIZE * numberOfCharactersPerByte);
      });
  it('When generatePasswordResetToken Then token not expired',
      async () => {
        const generatePasswordResetToken = makeGeneratePasswordResetToken();
        const token = await generatePasswordResetToken(
            DEFAULT_TOKEN_SIZE,
            DEFAULT_EXPIRY_TIME_MINUTES,
        );
        expect(token.expiryDate.getTime())
            .toBeGreaterThanOrEqual(new Date().getTime());
      });
});

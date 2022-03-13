import {makeVerifyEmail} from '../verify-email';

describe('verify email', () => {
  it('When make verifyEmail Then verifyEmail',
      async () => {
        const verifyEmail = makeVerifyEmail();

        expect(verifyEmail).not.toBeNull();
        expect(verifyEmail).toBeInstanceOf(Function);
      });
  it('When valid email address Then verified email address',
      async () => {
        const verifyEmail = makeVerifyEmail();

        const validEmail = 'johndoe@mail.com';
        const isVerified = verifyEmail(validEmail);

        expect(isVerified).toBeTruthy();
      });
  it('When invalid email address Then non-verified email address',
      async () => {
        const verifyEmail = makeVerifyEmail();

        const invalidEmail = 'johndoe.mail.com';
        const isVerified = verifyEmail(invalidEmail);

        expect(isVerified).not.toBeTruthy();
      });
});

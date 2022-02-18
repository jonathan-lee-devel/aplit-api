import {makeConfirmPasswordReset} from '../confirm-password-reset';
import {PasswordResetStatus} from '../enum/password-reset-status';

const encodePassword = async (password: string) => {
  return password;
};

describe('Confirm password reset', () => {
  it('When makeConfirmPasswordReset Then confirmPasswordReset',
      async () => {
        const passwordResetTokenModel = {};
        const userModel = {};
        const confirmPasswordReset = makeConfirmPasswordReset(
            passwordResetTokenModel,
            userModel,
            encodePassword);
        expect(confirmPasswordReset).not.toBeNull();
        expect(confirmPasswordReset).toBeInstanceOf(Function);
      });
  it('When confirmPasswordReset and no token Then invalid token',
      async () => {
        const passwordResetTokenModel = {
          findOne: (value: any): any => {
            return null;
          },
        };
        const userModel = {};
        const confirmPasswordReset = makeConfirmPasswordReset(
            passwordResetTokenModel,
            userModel,
            encodePassword);
        const token = 'token';
        const password = 'password';
        const confirmPasswordResetStatus =
            await confirmPasswordReset(token, password);
        expect(confirmPasswordResetStatus)
            .toBe(PasswordResetStatus.INVALID_TOKEN);
      });
  it('When confirmPasswordReset and no user Then failure',
      async () => {
        const token = 'token';
        const passwordResetTokenModel = {
          findOne: async (value: any) => {
            return token;
          },
        };
        const userModel = {
          findOne: async (value: any): Promise<any> => {
            return null;
          },
        };
        const confirmPasswordReset = makeConfirmPasswordReset(
            passwordResetTokenModel,
            userModel,
            encodePassword,
        );
        const password = 'password';
        const confirmPasswordResetStatus =
            await confirmPasswordReset(token, password);
        expect(confirmPasswordResetStatus)
            .toBe(PasswordResetStatus.FAILURE);
      });
});

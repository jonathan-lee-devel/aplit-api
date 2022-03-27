import {makeResetPassword} from '../reset-password';
import {PasswordResetStatus} from '../enum/password-reset-status';
import {Logger} from '../../../generic/Logger';

const innerLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};
const logger = new Logger(innerLogger);

describe('Reset password', () => {
  it('When makeResetPassword Then resetPassword',
      async () => {
        const sendMail = () => {};

        const userModel = {};
        const passwordResetTokenModel = {};

        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {},
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        expect(resetPassword).not.toBeNull();
        expect(resetPassword).toBeInstanceOf(Function);
      });
  it('When resetPassword and no user Then awaiting verification',
      async () => {
        const sendMail = () => {};

        const userModel = {
          findOne: (): any => undefined,
        };
        const passwordResetTokenModel = {};

        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {},
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        const resetPasswordStatus = await resetPassword(email);

        expect(resetPasswordStatus)
            .toBe(PasswordResetStatus.AWAITING_EMAIL_VERIFICATION);
      });
  it('When resetPassword and no token Then log error',
      async () => {
        let isErrorLogged = false;

        const sendMail = () => {};

        const userModel = {
          findOne: (_: any): any => {
            return {};
          },
        };
        const passwordResetTokenModel = {
          findOne: (_: any): any => undefined,
        };

        const resetPassword = makeResetPassword(
            // @ts-ignore
            {
              error: () => {
                isErrorLogged = true;
              },
            },
            // @ts-ignore
            () => {},
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        await resetPassword(email);

        expect(isErrorLogged).toBeTruthy();
      });
  it('When resetPassword and no token Then awaiting verification',
      async () => {
        const sendMail = () => {};

        const userModel = {
          findOne: (): any => {
            return {};
          },
        };
        const passwordResetTokenModel = {
          findOne: (): any => undefined,
        };

        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {},
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        const resetPasswordStatus = await resetPassword(email);

        expect(resetPasswordStatus)
            .toBe(PasswordResetStatus.AWAITING_EMAIL_VERIFICATION);
      });
  it('When resetPassword and no token Then generate password reset token',
      async () => {
        const sendMail = () => {};

        const userModel = {
          findOne: (): any => {
            return {};
          },
        };
        const passwordResetTokenModel = {
          findOne: (): any => {
            return {
              save: async () => {},
            };
          },
        };

        let isTokenGenerated = false;
        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {
              isTokenGenerated = true;
              return {
                value: '',
                expiryDate: new Date(),
              };
            },
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        await resetPassword(email);

        expect(isTokenGenerated).toBeTruthy();
      });
  it('When resetPassword and no token Then send mail',
      async () => {
        let isSendMailCalled = false;
        const sendMail = () => {
          isSendMailCalled = true;
        };

        const userModel = {
          findOne: (): any => {
            return {};
          },
        };
        const passwordResetTokenModel = {
          findOne: (): any => {
            return {
              save: async () => {},
            };
          },
        };

        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {
              return {
                value: '',
                expiryDate: new Date(),
              };
            },
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        await resetPassword(email);

        expect(isSendMailCalled).toBeTruthy();
      });
  it('When resetPassword and no token Then return awaiting email verification',
      async () => {
        const sendMail = () => {};

        const userModel = {
          findOne: (): any => {
            return {};
          },
        };
        const passwordResetTokenModel = {
          findOne: (): any => {
            return {
              save: async () => {},
            };
          },
        };

        const resetPassword = makeResetPassword(
            logger,
            // @ts-ignore
            () => {
              return {
                value: '',
                expiryDate: new Date(),
              };
            },
            sendMail,
            userModel,
            passwordResetTokenModel,
        );

        const email = 'johndoe@mail.com';
        const status = await resetPassword(email);

        expect(status).toBe(PasswordResetStatus.AWAITING_EMAIL_VERIFICATION);
      });
});

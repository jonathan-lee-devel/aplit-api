import {makeRegisterUser} from '../register-user';
import {Logger} from '../../../generic/Logger';
import {RegistrationStatus} from '../enum/registration-status';


describe('Register user', () => {
  it('When makeRegisterUser Then registerUser',
      async () => {
        const registerUser = makeRegisterUser(
            new Logger({}),
            async () => false,
            () => null,
            () => null,
            () => null,
            // @ts-ignore
            {},
        );
        expect(registerUser).not.toBeNull();
        expect(registerUser).toBeInstanceOf(Function);
      });
  it('When registerUser and user exists Then return status',
      async () => {
        const registerUser = makeRegisterUser(
            new Logger({}),
            async () => false,
            () => null,
            () => null,
            () => null,
            // @ts-ignore
            {},
        );

        const status = await registerUser(
            'email',
            'firstName',
            'lastName',
            'hashedPassword',
        );
        expect(status).toStrictEqual(RegistrationStatus.USER_ALREADY_EXISTS);
      });
  it('When registerUser and user doesn\'t exist Then tokens saved',
      async () => {
        let isGenerateAndPersistRegistrationVerificationTokenCalled =
            false;
        let isGenerateAndPersistExpiredPasswordResetVerificationTokenCalled =
            false;

        let isRegistrationVerificationTokenSaved = false;
        let isPasswordResetVerificationTokenSaved = false;

        const registerUser = makeRegisterUser(
            new Logger({}),
            async () => true,
            (): any => {
              isGenerateAndPersistRegistrationVerificationTokenCalled = true;
              return {
                save: (): any => {
                  isRegistrationVerificationTokenSaved = true;
                },
              };
            },
            (): any => {
              // eslint-disable-next-line max-len
              isGenerateAndPersistExpiredPasswordResetVerificationTokenCalled = true;
              return {
                save: (): any => {
                  isPasswordResetVerificationTokenSaved = true;
                },
              };
            },
            () => null,
            // @ts-ignore
            class {
              // eslint-disable-next-line require-jsdoc
              save() {}
            },
        );

        await registerUser(
            'email',
            'firstName',
            'lastName',
            'hashedPassword',
        );

        expect(isGenerateAndPersistRegistrationVerificationTokenCalled)
            .toBeTruthy();
        expect(isGenerateAndPersistExpiredPasswordResetVerificationTokenCalled)
            .toBeTruthy();
        expect(isRegistrationVerificationTokenSaved)
            .toBeTruthy();
        expect(isPasswordResetVerificationTokenSaved)
            .toBeTruthy();
      });
  it('When registerUser and user doesn\'t exist Then mail sent',
      async () => {
        let isMailSent = false;

        const registerUser = makeRegisterUser(
            new Logger({}),
            async () => true,
            (): any => {
              return {
                save: (): any => {
                },
              };
            },
            (): any => {
              // eslint-disable-next-line max-len
              return {
                save: (): any => {
                },
              };
            },
            async () => {
              isMailSent = true;
              return true;
            },
            // @ts-ignore
            class {
              // eslint-disable-next-line require-jsdoc
              save() {}
            },
        );

        await registerUser(
            'email',
            'firstName',
            'lastName',
            'hashedPassword',
        );

        expect(isMailSent).toBeTruthy();
      });
  it('When registerUser and user doesn\'t exist Then status returned',
      async () => {
        const registerUser = makeRegisterUser(
            new Logger({}),
            async () => true,
            (): any => {
              return {
                save: (): any => {
                },
              };
            },
            (): any => {
              // eslint-disable-next-line max-len
              return {
                save: (): any => {
                },
              };
            },
            () => null,
            // @ts-ignore
            class {
              // eslint-disable-next-line require-jsdoc
              save() {}
            },
        );

        const status = await registerUser(
            'email',
            'firstName',
            'lastName',
            'hashedPassword',
        );

        expect(status)
            .toStrictEqual(RegistrationStatus.AWAITING_EMAIL_VERIFICATION);
      });
});

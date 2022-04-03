import {makeConfirmRegistration} from '../confirm-registration';
import {RegistrationStatus} from '../enum/registration-status';
import {addDays} from 'date-fns';


describe('Confirm registration', () => {
  it('When makeConfirmRegistration Then confirmRegistration',
      async () => {
        const registrationVerificationTokenModel = {};
        const userModel = {};
        const confirmRegistration = makeConfirmRegistration(
            // @ts-ignore
            registrationVerificationTokenModel,
            userModel,
        );
        expect(confirmRegistration).not.toBeNull();
        expect(confirmRegistration).toBeInstanceOf(Function);
      });
  it('When confirmRegistration and no token Then invalid token',
      async () => {
        const registrationVerificationTokenModel = {
          findOne: (): any => null,
        };
        const userModel = {};
        const confirmRegistration = makeConfirmRegistration(
            // @ts-ignore
            registrationVerificationTokenModel,
            userModel,
        );
        const status = await confirmRegistration('token');
        expect(status).toBe(RegistrationStatus.INVALID_TOKEN);
      });
  it('When confirmRegistration and no user Then failure',
      async () => {
        const registrationVerificationTokenModel = {
          findOne: (): any => {
            return {};
          },
        };
        const userModel = {
          findOne: (): any => null,
        };
        const confirmRegistration = makeConfirmRegistration(
            // @ts-ignore
            registrationVerificationTokenModel,
            userModel,
        );
        const status = await confirmRegistration('token');
        expect(status).toBe(RegistrationStatus.FAILURE);
      });
  it('When confirmRegistration and token not expired Then save and success',
      async () => {
        let isRegistrationVerificationTokenSaved = false;
        const registrationVerificationTokenModel = {
          findOne: (): any => {
            return {
              expiryDate: addDays(new Date(), 1),
              save: (): any => {
                isRegistrationVerificationTokenSaved = true;
              },
            };
          },
        };
        let isUserSaved = false;
        const userModel = {
          findOne: (): any => {
            return {
              save: (): any => {
                isUserSaved = true;
              },
            };
          },
        };
        const confirmRegistration = makeConfirmRegistration(
            // @ts-ignore
            registrationVerificationTokenModel,
            userModel,
        );
        const status = await confirmRegistration('token');
        expect(isRegistrationVerificationTokenSaved).toBeTruthy();
        expect(isUserSaved).toBeTruthy();
        expect(status).toBe(RegistrationStatus.SUCCESS);
      });
  it('When confirmRegistration and expired token Then verification expired',
      async () => {
        const registrationVerificationTokenModel = {
          findOne: (): any => {
            return {
              expiryDate: new Date(),
            };
          },
        };
        const userModel = {
          findOne: (): any => {
            return {};
          },
        };
        const confirmRegistration = makeConfirmRegistration(
            // @ts-ignore
            registrationVerificationTokenModel,
            userModel,
        );
        const status = await confirmRegistration('token');
        expect(status).toBe(RegistrationStatus.EMAIL_VERIFICATION_EXPIRED);
      });
});

import {VerifyEmailFunction} from './index';

/**
 * Maker-function for verifying email.
 *
 * @return {Function} function for verifying email
 */
export const makeVerifyEmail = (): VerifyEmailFunction => {
  /**
   * Function for verifying email.
   *
   * @param {string} emailToVerify email address to be verified
   * @return {boolean} flag indicating if email address is valid
   */
  return function(emailToVerify: string): boolean {
    // eslint-disable-next-line max-len
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(emailToVerify);
  };
};

import {Response} from 'express-serve-static-core';
import {
  RegistrationStatus,
} from '../../../services/registration/enum/registration-status';
import {FormatRegistrationResponseFunction} from '../index';

/**
 * Maker-function for format registration response function.
 *
 * @return {Function} format registration response function
 */
export const makeFormatRegistrationResponse = ()
    : FormatRegistrationResponseFunction => {
  /**
   * Format registration response function.
   *
   * @param {Response} res object used to send response
   * @param {number} httpStatus HTTP status used for response
   * @param {RegistrationStatus} registrationStatus status of the registration
   */
  return function formatRegistrationResponse(
      res: Response,
      httpStatus: number,
      registrationStatus: RegistrationStatus,
  ) {
    res
        .status(httpStatus)
        .json({registration_status: RegistrationStatus[registrationStatus]});
  };
};

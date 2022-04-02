import {Response} from 'express-serve-static-core';
import {
  PasswordResetStatus,
} from '../../../services/password/enum/password-reset-status';
import {FormatPasswordResetResponseFunction} from '../index';

/**
 * Maker-function for format password reset response function.
 *
 * @return {Function} format password reset response function
 */
export const makeFormatPasswordResetResponse = ()
    : FormatPasswordResetResponseFunction => {
  /**
   * Helper function to format password reset responses.
   *
   * @param {Response} res object used to send response
   * @param {number} httpStatus HTTP status used for response
   * @param {PasswordResetStatus} passwordResetStatus status of the reset
   */
  return function formatPasswordResetResponse(
      res: Response,
      httpStatus: number,
      passwordResetStatus: PasswordResetStatus,
  ) {
    res
        .status(httpStatus)
        .json({
          password_reset_status: PasswordResetStatus[passwordResetStatus],
        });
  };
};

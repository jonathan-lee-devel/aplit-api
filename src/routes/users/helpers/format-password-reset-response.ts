import {Response} from 'express-serve-static-core';
import {
  PasswordResetStatus,
} from '../../../services/password/enum/password-reset-status';

export const makeFormatPasswordResetResponse = () => {
  return function formatPasswordResetResponse(
      res: Response,
      httpStatus: number,
      passwordResetStatus: PasswordResetStatus,
  ) {
    res
        .status(httpStatus)
        .json({
          password_reset_status: PasswordResetStatus[passwordResetStatus]
        });
  };
};

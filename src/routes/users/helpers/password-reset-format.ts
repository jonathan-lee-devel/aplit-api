import {Response} from 'express-serve-static-core';
import {
  PasswordResetStatus,
} from '../../../services/password-reset/enum/password-reset-status';

export const formatPasswordResetResponse = (
    res: Response,
    httpStatus: number,
    passwordResetStatus: PasswordResetStatus,
) => {
  res
      .status(httpStatus)
      .json({password_reset_status: PasswordResetStatus[passwordResetStatus]});
};

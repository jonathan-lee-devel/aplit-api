import crypto from 'crypto';
import npmlog from 'npmlog';
import {getLoggingPrefix} from '../../config/Logger';

export const generateId = async (logger: npmlog.Logger): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(12, (err, buffer) => {
      if (err) {
        logger.error(getLoggingPrefix(), 'Error: %j', err);
        return reject(err);
      }
      return resolve(buffer.toString('hex'));
    });
  });
};

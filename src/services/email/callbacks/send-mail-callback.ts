import {Logger} from '../../../generic/Logger';
import {SendMailCallbackFunction} from '../index';
import {SentMessageInfo} from 'nodemailer';

export const makeSendMailCallback = (
    logger: Logger,
): SendMailCallbackFunction => {
  return function sendMailCallback(
      err: Error | null,
      info: SentMessageInfo,
  ) {
    if (err) {
      logger.error(err.message);
      return false;
    }
    logger.info(
        `E-mail sent with response: ${info.response}`,
    );
    return true;
  };
};


import {Transporter} from 'nodemailer';
import {EmailSendStatus} from './enum/email-send-status';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import npmlog from 'npmlog';
import {getLoggingPrefix} from '../../config/Logger';

export const sendMail = async (
    logger: npmlog.Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    addressTo: string,
    subject: string,
    text: string,
): Promise<EmailSendStatus> => {
  await transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: addressTo,
        subject,
        text,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          return EmailSendStatus.FAILED;
        }
        logger.info(
            getLoggingPrefix(), 'E-mail sent to %s with response: %s',
            addressTo, info.response,
        );
        return EmailSendStatus.SENT;
      },
  );

  return EmailSendStatus.FAILED;
};

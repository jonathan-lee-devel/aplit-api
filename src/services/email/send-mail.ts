import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {Logger} from '../../generic/Logger';

export const makeSendMail = (
    logger: Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
) => {
  return async function sendMail(
      addressTo: string,
      subject: string,
      text: string,
  ): Promise<boolean> {
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
            return false;
          }
          logger.info(
              `E-mail sent to ${addressTo} with response: ${info.response}`,
          );
          return true;
        },
    );

    return false;
  };
};

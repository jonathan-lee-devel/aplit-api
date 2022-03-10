import {Logger} from './Logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

const logger = new Logger();

/**
 * Generic mailer used to allow for different approaches
 * for sending e-mails to be used without major refactor.
 */
export class Mailer {
  private readonly ADDRESS_FROM = 'dev.jonathanlee@gmail.com';
  private transporter: Mail<SMTPTransport.SentMessageInfo>;

  /**
   * Basic constructor.
   *
   * @param {Mail<SMTPTransport.SentMessageInfo>} transporter to be used
   */
  constructor(transporter: Mail<SMTPTransport.SentMessageInfo>) {
    this.transporter = transporter;
  }

  /**
     * Sends e-mail.
     *
     * @param {string} addressTo address to which e-mail is to be sent
     * @param {string} subject subject of the e-mail to be sent
     * @param {string} htmlContents contents of the e-mail in HTML format
     */
  sendMail(addressTo: string, subject: string, htmlContents: string) {
    this.transporter.sendMail({
      from: this.ADDRESS_FROM,
      to: addressTo,
      subject: subject,
      html: htmlContents,
    }).then((response) => {
      logger.info(`E-mail sent with response: ${response.response}`);
    }).catch(((reason) => {
      logger.error(reason);
    }));
  }
}
